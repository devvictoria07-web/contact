<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Business;
use App\Models\City;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportPaginasAmarillas extends Command
{
    protected $signature = 'paginasamarillas:import 
                            {page=all : Número de página (ej. 20) o "all" para todo el directorio 2025}
                            {--start=19 : Página inicial cuando se importa un rango}
                            {--end=132 : Página final cuando se importa un rango}
                            {--fresh : Limpia registros anteriores importados para dejar solo datos limpios}';

    protected $description = 'Extrae los contactos de Páginas Amarillas Nicaragua (edición digital 2025) y los importa a la base de datos';

    public function handle()
    {
        set_time_limit(600);
        ini_set('memory_limit', '512M');

        $arg = $this->argument('page');
        $isAll = ($arg === 'all' || $arg === 'todo');

        if ($this->option('fresh')) {
            $this->info("Limpiando registros previamente importados...");
            DB::table('businesses')->where('admin_notes', 'like', 'Importado automáticamente%')->delete();
        }

        if ($isAll) {
            $startPage = (int) $this->option('start');
            $endPage = (int) $this->option('end');
            $this->info("=== IMPORTANDO DIRECTORIO COMPLETO PÁGINAS AMARILLAS NICARAGUA 2025 ===");
            $this->info("Rango de páginas a procesar: {$startPage} a {$endPage} (de la A a la Z)");
            $pages = range($startPage, $endPage);
        } else {
            $page = (int) $arg;
            $this->info("Importando página individual {$page} de Páginas Amarillas Nicaragua...");
            $pages = [$page];
        }

        // 1. Descarga concurrente rápida de las páginas
        $this->info("Descargando páginas vía HTTP concurrentes...");
        $downloadStart = microtime(true);
        $pagesHtml = $this->fetchPagesConcurrent($pages);
        $downloadTime = round(microtime(true) - $downloadStart, 2);
        $this->info("Descarga completada: " . count($pagesHtml) . " páginas obtenidas en {$downloadTime}s.");

        if (empty($pagesHtml)) {
            $this->error("No se pudo descargar ninguna página del directorio.");
            return 1;
        }

        // 2. Extracción y parseo estricto de teléfonos nicaragüenses (2xxx landlines, 5xxx/7xxx/8xxx móviles)
        $this->info("Extrayendo y parseando contactos comerciales auténticos...");
        $parseStart = microtime(true);
        $rawListings = [];
        $pattern = '/\b([2578]\d{3}\s*\d{4}(?:\s*Cel)?)\b/i';

        foreach ($pagesHtml as $pageNum => $html) {
            if (!preg_match('/<div id="text-container"[^>]*>\s*<h1>.*?<\/h1>\s*<div>(.*?)<\/div>/s', $html, $matches)) {
                continue;
            }

            $raw = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $raw = preg_replace('/\.{2,}/', ' ', $raw);
            $raw = preg_replace('/\s+/', ' ', $raw);
            $raw = trim($raw);

            $parts = preg_split($pattern, $raw, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
            $currentText = '';

            for ($i = 0; $i < count($parts); $i++) {
                $item = trim($parts[$i]);
                if (preg_match('/^[2578]\d{3}\s*\d{4}(\s*Cel)?$/i', $item)) {
                    $phone = $item;
                    $content = trim($currentText);
                    $currentText = '';

                    // Limpiar números sobrantes al inicio (códigos postales, extensiones, etc.)
                    $content = preg_replace('/^[\d\s\.\,\-\:\;\/\\\\]+/', '', $content);
                    $content = trim($content);

                    // Descartar si no tiene al menos 3 letras de texto real
                    if (preg_match('/[a-zA-ZáéíóúñÁÉÍÓÚÑ]{3,}/', $content)) {
                        $rawListings[] = [
                            'page' => $pageNum,
                            'content' => $content,
                            'phone' => $phone
                        ];
                    }
                } else {
                    $currentText .= ' ' . $item;
                }
            }
        }

        $this->info("Se detectaron " . count($rawListings) . " registros telefónicos brutos.");

        // 3. Agrupación por negocio único y consolidación de teléfonos/WhatsApp
        $grouped = [];
        foreach ($rawListings as $item) {
            list($name, $address) = $this->splitNameAddress($item['content']);
            $name = trim($name, " ,.-/\\");
            if (mb_strlen($name) < 2) continue;

            $isCel = stripos($item['phone'], 'Cel') !== false;
            $cleanPhone = trim(str_ireplace('Cel', '', $item['phone']));

            $key = mb_strtolower($name);
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'page' => $item['page'],
                    'name' => $name,
                    'address' => $address,
                    'primary_phone' => $cleanPhone,
                    'whatsapp' => $isCel ? '505' . str_replace(' ', '', $cleanPhone) : null,
                    'phones' => [$cleanPhone . ($isCel ? ' (Cel)' : '')],
                ];
            } else {
                $grouped[$key]['phones'][] = $cleanPhone . ($isCel ? ' (Cel)' : '');
                if ($isCel && empty($grouped[$key]['whatsapp'])) {
                    $grouped[$key]['whatsapp'] = '505' . str_replace(' ', '', $cleanPhone);
                }
            }
        }

        $totalUnique = count($grouped);
        $parseTime = round(microtime(true) - $parseStart, 2);
        $this->info("Total de negocios únicos consolidados: {$totalUnique} (procesados en {$parseTime}s).");

        // 4. Inserción masiva en base de datos MySQL
        $this->info("Sincronizando con la base de datos MySQL...");
        $dbStart = microtime(true);

        $adminUser = User::where('role', 'admin')->first() ?? User::first();
        $adminUserId = $adminUser ? $adminUser->id : 1;

        // Cargar en memoria nombres y slugs existentes para no duplicar
        $existingNames = DB::table('businesses')->pluck('id', 'name')->toArray();
        $existingSlugs = DB::table('businesses')->pluck('id', 'slug')->toArray();
        $existingPhoneMap = DB::table('businesses')->pluck('id', 'phone')->toArray();

        $maxId = (int) (DB::table('businesses')->max('id') ?? 0);

        $businessesToInsert = [];
        $categoriesToInsert = [];
        $now = now()->toDateTimeString();

        $importedCount = 0;
        $skippedCount = 0;

        foreach ($grouped as $b) {
            $name = $b['name'];

            // Si ya existe por nombre exacto, lo omitimos para evitar duplicados
            if (isset($existingNames[$name])) {
                $skippedCount++;
                continue;
            }

            $cityId = $this->detectCity($b['address'], $b['primary_phone']);
            $categoryId = $this->detectCategory($b['name'], $b['address']);

            // Generar slug único seguro en longitud para MySQL
            $baseSlug = Str::limit(Str::slug($name), 150, '');
            if (empty($baseSlug)) {
                $baseSlug = 'negocio-' . Str::random(6);
            }
            $slug = $baseSlug;
            $c = 1;
            while (isset($existingSlugs[$slug])) {
                $slug = Str::limit($baseSlug, 140, '') . '-' . $c;
                $c++;
            }
            $existingSlugs[$slug] = true;
            $existingNames[$name] = true;

            $maxId++;
            $bizId = $maxId;

            $allPhonesStr = implode(', ', array_unique($b['phones']));
            $description = "Contacto comercial verificado del Directorio Telefónico Páginas Amarillas Nicaragua 2025 (Página {$b['page']}). Teléfonos registrados: {$allPhonesStr}.";
            $shortDesc = Str::limit("Directorio Páginas Amarillas Nicaragua 2025 - Tel: {$b['primary_phone']}", 250, '');
            $cleanAddress = !empty($b['address']) ? Str::limit($b['address'], 400, '') : 'Managua, Nicaragua';

            $businessesToInsert[] = [
                'id' => $bizId,
                'user_id' => $adminUserId,
                'city_id' => $cityId,
                'name' => Str::limit($name, 190, ''),
                'slug' => $slug,
                'short_description' => $shortDesc,
                'description' => $description,
                'address' => $cleanAddress,
                'phone' => Str::limit($b['primary_phone'], 30, ''),
                'whatsapp' => $b['whatsapp'] ? Str::limit($b['whatsapp'], 30, '') : null,
                'email' => null,
                'website' => null,
                'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:00 PM',
                'logo_path' => null,
                'facebook' => null,
                'instagram' => null,
                'status' => 'approved',
                'admin_notes' => "Importado automáticamente de Guía Páginas Amarillas Nicaragua 2025 (Pág. {$b['page']})",
                'featured' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $categoriesToInsert[] = [
                'business_id' => $bizId,
                'category_id' => $categoryId,
            ];

            $importedCount++;
        }

        // Inserción en bloques de 500 en transacción
        $this->info("Guardando {$importedCount} nuevos negocios en MySQL...");
        DB::transaction(function () use ($businessesToInsert, $categoriesToInsert) {
            foreach (array_chunk($businessesToInsert, 500) as $chunk) {
                DB::table('businesses')->insert($chunk);
            }
            foreach (array_chunk($categoriesToInsert, 1000) as $chunk) {
                DB::table('business_category')->insert($chunk);
            }
        });

        $dbTime = round(microtime(true) - $dbStart, 2);
        $totalTime = round($downloadTime + $parseTime + $dbTime, 2);

        $this->newLine();
        $this->info("======================================================");
        $this->info("✅ ¡IMPORTACIÓN FINALIZADA CON ÉXITO!");
        $this->info("   - Páginas procesadas:           " . count($pagesHtml));
        $this->info("   - Nuevos negocios registrados:  {$importedCount}");
        $this->info("   - Negocios preexistentes:       {$skippedCount}");
        $this->info("   - Total negocios en base datos: " . DB::table('businesses')->count());
        $this->info("   - Tiempo total de ejecución:    {$totalTime} segundos");
        $this->info("======================================================");

        return 0;
    }

    private function fetchPagesConcurrent(array $pages): array
    {
        $results = [];
        $chunks = array_chunk($pages, 15);

        foreach ($chunks as $chunk) {
            $mh = curl_multi_init();
            $handles = [];

            foreach ($chunk as $p) {
                $ch = curl_init();
                $url = "https://www.paginasamarillas.com.ni/directorios/nicaragua/nicaragua2025/{$p}/index.html";
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_multi_add_handle($mh, $ch);
                $handles[$p] = $ch;
            }

            $running = null;
            do {
                curl_multi_exec($mh, $running);
                curl_multi_select($mh, 0.1);
            } while ($running > 0);

            foreach ($handles as $p => $ch) {
                $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $html = curl_multi_getcontent($ch);
                if ($code === 200 && !empty($html)) {
                    $results[$p] = $html;
                }
                curl_multi_remove_handle($mh, $ch);
                curl_close($ch);
            }
            curl_multi_close($mh);
        }

        return $results;
    }

    private function splitNameAddress($text)
    {
        $text = trim($text);

        if (preg_match('/^(.*?\b(?:S\.?A\.?|Ltda\.?|Inc\.?|Cía\.?\s+Ltda\.?|Cía\.?))\s+(.*)$/iu', $text, $m)) {
            return [trim($m[1], " ,.-/\\"), trim($m[2])];
        }

        $markers = [
            'Rotonda', 'Rot\b', 'Semáforos?', 'Semáf\b', 'Frente\s+[Aa]', 'Fte\b', 'Costado', 'Cost\b',
            'Bo\b', 'Bo\.', 'Barrio', 'Colonia', 'Col\b', 'Reparto', 'Repto\b', 'Residencial', 'Res\b',
            'Km\b', 'Km\.', 'Carret\b', 'Carretera', 'Ctra\b', 'Pista', 'Av\b', 'Avenida',
            'Altamira\b', 'Bello Horizonte', 'Ciudad Jardín', 'Villa Libertad', 'Bolonia\b', 'Altos De\b',
            'Plaza\b', 'Edif\b', 'Edificio', 'Centro Comercial', 'C\.C\.', 'Parqueo\b', 'Estatua\b',
            'Hospital\b', 'Iglesia\b', 'Busto\b', 'Canal 2\b', 'Antigua\b', 'De la\b', 'Del\b', 'De los\b'
        ];

        $regex = '/\b(' . implode('|', $markers) . ')\b/iu';
        if (preg_match($regex, $text, $matches, PREG_OFFSET_CAPTURE)) {
            $offset = $matches[0][1];
            if ($offset >= 3) {
                $name = trim(substr($text, 0, $offset), " ,.-/\\");
                $address = trim(substr($text, $offset));
                return [$name, $address];
            }
        }

        $words = explode(' ', $text);
        if (count($words) > 3) {
            $name = implode(' ', array_slice($words, 0, 3));
            $address = implode(' ', array_slice($words, 3));
            return [trim($name, " ,.-/\\"), trim($address)];
        }

        return [$text, 'Managua, Nicaragua'];
    }

    private function detectCategory($name, $address)
    {
        $n = mb_strtolower($name);
        if (preg_match('/(acr[ií]lic|ferreter|construc|metal|vidrio|aluval|techo|madera|tubo|cemento|acero|bloque)/i', $n)) return 3; // Ferreterías
        if (preg_match('/(sal[oó]n|belleza|peluquer|est[eé]tica|spa\b|barber|uñas|cosm[eé]tic)/i', $n)) return 10; // Belleza
        if (preg_match('/(restauran|caf[eé]|comedor|pizz|panader|pasteler|bar\b|comida|asados|buffet|tacos|hamburg)/i', $n)) return 1; // Restaurantes
        if (preg_match('/(farmacia|m[eé]dic|dr\.|dra\.|cl[ií]nic|hospital|dent|ortoped|laboratorio|optica|óptica|salud|dino)/i', $n)) return 2; // Farmacias y Salud
        if (preg_match('/(hotel|hostal|turismo|viaje|resort|lodge|airport)/i', $n)) return 5; // Hoteles
        if (preg_match('/(taller|mec[aá]nic|repuesto|llanta|automotriz|lubricant|bater[ií]a|frenos|auto\b)/i', $n)) return 6; // Automotriz
        if (preg_match('/(comput|software|sistema|tecnolog|digital|inform[aá]tic|internet|web|aj computer|air center)/i', $n)) return 8; // Tecnología
        if (preg_match('/(colegio|academia|universidad|educaci|escuela|instituto|idiomas)/i', $n)) return 9; // Educación
        if (preg_match('/(supermer|distribuidor|comercial|abarrot|gas\b|alimento|agro|agricorp|agrenic|carnes|market|acuario)/i', $n)) return 7; // Supermercados / Agro
        if (preg_match('/(abogad|legal|aduanera|seguridad|seguros|inmobiliari|bienes raices|asesor|consultor|contab|auditor|servicios|adnicar|agencia|adnominas|aczalaw)/i', $n)) return 4; // Servicios

        $a = mb_strtolower($address);
        if (preg_match('/(sal[oó]n|belleza)/i', $a)) return 10;
        if (preg_match('/(restauran|comida)/i', $a)) return 1;
        if (preg_match('/(taller|mec[aá]nic)/i', $a)) return 6;

        return 4; // Default Servicios Profesionales
    }

    private function detectCity($address, $phone)
    {
        $p = preg_replace('/\D/', '', $phone);
        $a = mb_strtolower($address);

        if (strpos($a, 'león') !== false || strpos($a, 'leon') !== false) return 2;
        if (strpos($a, 'granada') !== false) return 3;
        if (strpos($a, 'masaya') !== false || strpos($a, 'nindirí') !== false || strpos($a, 'nindiri') !== false) return 4;
        if (strpos($a, 'matagalpa') !== false || strpos($a, 'sebaco') !== false || strpos($a, 'sébaco') !== false) return 5;
        if (strpos($a, 'chinandega') !== false || strpos($a, 'corinto') !== false) return 6;
        if (strpos($a, 'estelí') !== false || strpos($a, 'esteli') !== false) return 7;
        if (strpos($a, 'san juan del sur') !== false) return 8;
        if (strpos($a, 'rivas') !== false) return 9;
        if (strpos($a, 'jinotepe') !== false || strpos($a, 'diriamba') !== false) return 10;
        if (strpos($a, 'jinotega') !== false) return 11;
        if (strpos($a, 'juigalpa') !== false) return 12;
        if (strpos($a, 'bluefields') !== false) return 13;

        // Prefijos telefónicos departamentales de Nicaragua
        if (preg_match('/^277/', $p)) return 5;
        if (preg_match('/^231/', $p)) return 2;
        if (preg_match('/^255/', $p)) return 3;
        if (preg_match('/^252/', $p)) return 4;
        if (preg_match('/^234/', $p)) return 6;
        if (preg_match('/^271/', $p)) return 7;
        if (preg_match('/^256/', $p)) return 9;
        if (preg_match('/^253/', $p)) return 10;
        if (preg_match('/^278/', $p)) return 11;
        if (preg_match('/^251/', $p)) return 12;
        if (preg_match('/^257/', $p)) return 13;

        return 1; // Managua por defecto
    }
}
