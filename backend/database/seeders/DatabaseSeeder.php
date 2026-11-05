<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@paginasamarillas.com.ni'],
            [
                'name' => 'Administrador General',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'phone' => '+505 2255 8800',
            ]
        );

        $owner = User::firstOrCreate(
            ['email' => 'propietario@ejemplo.com'],
            [
                'name' => 'Carlos Mendoza (Dueño de Negocios)',
                'password' => Hash::make('owner123'),
                'role' => 'owner',
                'phone' => '+505 8888 1234',
            ]
        );

        $owner2 = User::firstOrCreate(
            ['email' => 'mariana.lopez@ejemplo.com'],
            [
                'name' => 'Mariana López (Empresaria)',
                'password' => Hash::make('owner123'),
                'role' => 'owner',
                'phone' => '+505 8765 4321',
            ]
        );

        User::firstOrCreate(
            ['email' => 'visitante@ejemplo.com'],
            [
                'name' => 'Visitante Comercial',
                'password' => Hash::make('visitor123'),
                'role' => 'visitor',
                'phone' => '+505 8555 9999',
            ]
        );

        // 2. Create Cities / Departments of Nicaragua
        $citiesData = [
            ['name' => 'Managua', 'department' => 'Managua'],
            ['name' => 'León', 'department' => 'León'],
            ['name' => 'Granada', 'department' => 'Granada'],
            ['name' => 'Masaya', 'department' => 'Masaya'],
            ['name' => 'Matagalpa', 'department' => 'Matagalpa'],
            ['name' => 'Chinandega', 'department' => 'Chinandega'],
            ['name' => 'Estelí', 'department' => 'Estelí'],
            ['name' => 'San Juan del Sur', 'department' => 'Rivas'],
            ['name' => 'Rivas', 'department' => 'Rivas'],
            ['name' => 'Jinotepe', 'department' => 'Carazo'],
            ['name' => 'Jinotega', 'department' => 'Jinotega'],
            ['name' => 'Juigalpa', 'department' => 'Chontales'],
            ['name' => 'Bluefields', 'department' => 'RACCS'],
        ];

        $cities = [];
        foreach ($citiesData as $item) {
            $cities[$item['name']] = City::firstOrCreate(
                ['name' => $item['name'], 'department' => $item['department']],
                ['slug' => Str::slug($item['name'] . '-' . $item['department'])]
            );
        }

        // 3. Create Categories
        $categoriesData = [
            ['name' => 'Restaurantes y Cafeterías', 'icon' => 'Utensils', 'description' => 'Gastronomía nicaragüense e internacional, asados, cafés y pastelerías.'],
            ['name' => 'Farmacias y Salud', 'icon' => 'HeartPulse', 'description' => 'Medicamentos, clínicas médicas, laboratorios y atención odontológica.'],
            ['name' => 'Ferreterías y Construcción', 'icon' => 'Hammer', 'description' => 'Materiales de construcción, herramientas, pinturas y fontanería.'],
            ['name' => 'Servicios Profesionales', 'icon' => 'Briefcase', 'description' => 'Abogados, notarios, contadores públicos y consultores de negocios.'],
            ['name' => 'Hoteles y Turismo', 'icon' => 'Hotel', 'description' => 'Hospedajes, resorts, eco-lodges y agencias de viajes en Nicaragua.'],
            ['name' => 'Talleres y Automotriz', 'icon' => 'Car', 'description' => 'Mecánica general, repuestos, llanterías y lavado de vehículos.'],
            ['name' => 'Supermercados y Abarrotes', 'icon' => 'ShoppingCart', 'description' => 'Alimentos, artículos de primera necesidad y distribuidoras mayoristas.'],
            ['name' => 'Tecnología y Computación', 'icon' => 'Laptop', 'description' => 'Venta de computadoras, redes, servicio técnico y desarrollo de software.'],
            ['name' => 'Educación y Academias', 'icon' => 'GraduationCap', 'description' => 'Colegios, universidades, centros de idiomas y capacitación técnica.'],
            ['name' => 'Belleza y Cuidado Personal', 'icon' => 'Scissors', 'description' => 'Salones de belleza, barberías, spas y estética.'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['name']] = Category::firstOrCreate(
                ['name' => $cat['name']],
                [
                    'slug' => Str::slug($cat['name']),
                    'icon' => $cat['icon'],
                    'description' => $cat['description'],
                ]
            );
        }

        // 4. Sample Businesses (18 realistic businesses)
        $businessesData = [
            [
                'name' => 'Restaurante El Güegüense Managua',
                'user_id' => $owner->id,
                'city' => 'Managua',
                'categories' => ['Restaurantes y Cafeterías', 'Hoteles y Turismo'],
                'short_description' => 'Auténtica comida típica nicaragüense, asados premium y ambiente cultural folclórico.',
                'description' => 'Ubicado en el corazón de Managua, Restaurante El Güegüense ofrece lo mejor de la tradición culinaria de Nicaragua: caballo bayo, baho, vigorón, nacatamales los fines de semana y carnes asadas al carbón con tortillas calientes y queso frito.',
                'address' => 'De la Rotonda El Güegüense 1c. al lago, 75 varas arriba, Bolonia, Managua',
                'phone' => '+505 2266 9090',
                'whatsapp' => '+505 8855 2200',
                'email' => 'contacto@elgueguensenica.com',
                'website' => 'https://elgueguensenica.com',
                'opening_hours' => 'Lunes a Domingo: 11:00 AM - 10:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/elgueguensestaurante',
                'instagram' => 'https://instagram.com/elgueguense_rest',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Farmacias Saba Managua Central',
                'user_id' => $owner->id,
                'city' => 'Managua',
                'categories' => ['Farmacias y Salud'],
                'short_description' => 'Cadena líder en medicamentos con servicio a domicilio 24 horas y descuentos permanentes.',
                'description' => 'Farmacias Saba cuenta con amplio inventario en medicamentos éticos y genéricos, productos ortopédicos, fórmulas infantiles y dermocosmética. Servicio exprés a todo Managua.',
                'address' => 'Plaza España, frente a edificio BAC Credomatic, Managua',
                'phone' => '+505 2278 7222',
                'whatsapp' => '+505 8899 7222',
                'email' => 'atencion@farmaciassaba.com.ni',
                'website' => 'https://farmaciassaba.com.ni',
                'opening_hours' => 'Abierto 24 Horas los 365 días del año',
                'logo_path' => 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/farmaciassabanica',
                'instagram' => 'https://instagram.com/farmaciassaba',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Ferretería Jenny Sucursal Portezuelo',
                'user_id' => $owner->id,
                'city' => 'Managua',
                'categories' => ['Ferreterías y Construcción'],
                'short_description' => 'Soluciones completas en hierro, cemento, herramientas eléctricas y plomería.',
                'description' => 'Distribuidor autorizado de marcas líderes internacionales. Asesoría técnica especializada para proyectos residenciales e industriales en todo el país.',
                'address' => 'Carretera Norte Km 5.5, Frente a Siemens, Managua',
                'phone' => '+505 2249 5500',
                'whatsapp' => '+505 8922 1133',
                'email' => 'ventas@ferreteriajenny.com.ni',
                'website' => 'https://ferreteriajenny.com.ni',
                'opening_hours' => 'Lunes a Viernes: 7:30 AM - 5:30 PM | Sábados: 8:00 AM - 2:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/ferreteriajenny',
                'instagram' => null,
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Bufete Jurídico & Notarial Miranda & Asociados',
                'user_id' => $owner2->id,
                'city' => 'Managua',
                'categories' => ['Servicios Profesionales'],
                'short_description' => 'Asesoría legal corporativa, derecho mercantil, laboral, propiedad raíz y marcas.',
                'description' => 'Más de 20 años de experiencia asesorando a empresas nacionales y extranjeras en constitución de sociedades, cumplimiento fiscal, litigios civiles y trámites de inversión en Nicaragua.',
                'address' => 'Plaza San Agustín, Módulo 4, Los Robles, Managua',
                'phone' => '+505 2270 3410',
                'whatsapp' => '+505 8450 6780',
                'email' => 'info@mirandayasociados.com.ni',
                'website' => 'https://mirandayasociados.com.ni',
                'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/bufetemiranda',
                'instagram' => null,
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Hotel Boutique & Eco-Lodge Selva Negra',
                'user_id' => $owner2->id,
                'city' => 'Matagalpa',
                'categories' => ['Hoteles y Turismo', 'Restaurantes y Cafeterías'],
                'short_description' => 'Hospedaje ecológico de montaña, senderos en bosque nuboso y tours de café orgánico.',
                'description' => 'Disfruta del clima fresco de Matagalpa en cabañas estilo bávaro rodeadas de naturaleza virgen. Incluye restaurante con quesos y carnes producidas en la misma hacienda sostenible.',
                'address' => 'Carretera Matagalpa - Jinotega Km 140, Matagalpa',
                'phone' => '+505 2772 4034',
                'whatsapp' => '+505 8884 5511',
                'email' => 'reservas@selvanegra.com',
                'website' => 'https://selvanegra.com',
                'opening_hours' => 'Recepción 24 horas | Restaurante: 7:00 AM - 9:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/selvanegranica',
                'instagram' => 'https://instagram.com/selvanegranica',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Taller Automotriz El Volcán León',
                'user_id' => $owner->id,
                'city' => 'León',
                'categories' => ['Talleres y Automotriz'],
                'short_description' => 'Mecánica de precisión, escaneo computarizado, frenos, suspensión y aire acondicionado.',
                'description' => 'Especialistas en vehículos japoneses y coreanos (Toyota, Nissan, Hyundai, Kia). Diagnóstico por computadora con tecnología de punta y repuestos genuinos garantizados.',
                'address' => 'Costado sur de la Iglesia San Juan 2c. abajo, León',
                'phone' => '+505 2311 4890',
                'whatsapp' => '+505 8733 9021',
                'email' => 'tallerelvolcanleon@gmail.com',
                'website' => null,
                'opening_hours' => 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/tallerelvolcanleon',
                'instagram' => null,
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Hotel Plaza Colón Granada',
                'user_id' => $owner2->id,
                'city' => 'Granada',
                'categories' => ['Hoteles y Turismo'],
                'short_description' => 'Elegante hotel colonial con vista directa al Parque Central y la Catedral de Granada.',
                'description' => 'Arquitectura señorial neoclásica del siglo XIX cuidadosamente restaurada. Habitaciones con aire acondicionado de alta eficiencia, piscina en patio colonial y exquisito desayuno gourmet.',
                'address' => 'Calle La Libertad, Frente al Parque Colón, Granada',
                'phone' => '+505 2552 2880',
                'whatsapp' => '+505 8820 4499',
                'email' => 'reservaciones@hotelplazacolon.com',
                'website' => 'https://hotelplazacolon.com',
                'opening_hours' => 'Atención al huésped 24/7',
                'logo_path' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/plazacolongranada',
                'instagram' => 'https://instagram.com/hotelplazacolon',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Supermercado La Canasta Masaya',
                'user_id' => $owner->id,
                'city' => 'Masaya',
                'categories' => ['Supermercados y Abarrotes'],
                'short_description' => 'Frutas, verduras frescas, carnes de primera calidad y abarrotes con los mejores precios.',
                'description' => 'Variedad de productos nacionales e importados para el hogar y restaurantes locales. Pagos en efectivo, tarjeta de débito/crédito y transferencias móviles.',
                'address' => 'De la Rotonda San Jerónimo 150 metros al oeste, Masaya',
                'phone' => '+505 2522 3344',
                'whatsapp' => '+505 8644 1122',
                'email' => 'pedidos@lacanastamasaya.com',
                'website' => 'https://lacanastamasaya.com',
                'opening_hours' => 'Lunes a Domingo: 7:00 AM - 8:30 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/superlacanastamasaya',
                'instagram' => null,
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'CompuNica Soluciones Tecnológicas',
                'user_id' => $owner2->id,
                'city' => 'Managua',
                'categories' => ['Tecnología y Computación', 'Servicios Profesionales'],
                'short_description' => 'Venta de laptops, servidores, cámaras de seguridad CCTV, cableado estructurado y soporte.',
                'description' => 'Distribuidores de Dell, HP, Lenovo, Hikvision y MikroTik. Mantenimiento preventivo y correctivo para empresas y centros educativos.',
                'address' => 'Colonia Centroamérica, Grupo E, Casa 45, Managua',
                'phone' => '+505 2277 8899',
                'whatsapp' => '+505 8911 4455',
                'email' => 'ventas@compunica.com.ni',
                'website' => 'https://compunica.com.ni',
                'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:30 PM | Sábados: 8:30 AM - 1:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/compunicanic',
                'instagram' => 'https://instagram.com/compunicanic',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Clínica Dental & Ortodoncia San Juan',
                'user_id' => $owner->id,
                'city' => 'San Juan del Sur',
                'categories' => ['Farmacias y Salud', 'Servicios Profesionales'],
                'short_description' => 'Odontología integral, implantes, diseño de sonrisa y blanqueamiento láser.',
                'description' => 'Atención odontológica bilingüe (español e inglés) para residentes locales y visitantes internacionales con equipos digitales de rayos X y esterilización hospitalaria.',
                'address' => 'Frente al Mercado Municipal de San Juan del Sur, Rivas',
                'phone' => '+505 2568 2040',
                'whatsapp' => '+505 8500 1199',
                'email' => 'citas@dentalsanjuandelsur.com',
                'website' => 'https://dentalsanjuandelsur.com',
                'opening_hours' => 'Lunes a Sábado: 8:30 AM - 5:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/dentalsanjuandelsur',
                'instagram' => 'https://instagram.com/dentalsanjuandelsur',
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Constructora del Norte Estelí (CONSAN)',
                'user_id' => $owner2->id,
                'city' => 'Estelí',
                'categories' => ['Ferreterías y Construcción', 'Servicios Profesionales'],
                'short_description' => 'Diseño arquitectónico, supervisión de obras viales, residenciales y comerciales.',
                'description' => 'Equipo multidisciplinario de ingenieros civiles y arquitectos con proyectos ejecutados en Las Segovias. Renta de maquinaria pesada y asesoría de permisos de construcción.',
                'address' => 'De ENACAL 1c. al sur, 2c. al este, Estelí',
                'phone' => '+505 2713 5580',
                'whatsapp' => '+505 8812 7700',
                'email' => 'proyectos@consannicaragua.com',
                'website' => 'https://consannicaragua.com',
                'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/consanesteli',
                'instagram' => null,
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Auto Repuestos & Baterías El Chinandegano',
                'user_id' => $owner->id,
                'city' => 'Chinandega',
                'categories' => ['Talleres y Automotriz'],
                'short_description' => 'Repuestos automotrices, amortiguadores, filtros, lubricantes y baterías con garantía.',
                'description' => 'Importación directa de partes originales y genéricas clase A. Instalación de baterías a domicilio sin costo adicional en el casco urbano de Chinandega.',
                'address' => 'Entrada principal a Chinandega, de la Gasolinera Uno 1c. al este',
                'phone' => '+505 2341 6020',
                'whatsapp' => '+505 8421 9900',
                'email' => 'chinandeganorepuestos@hotmail.com',
                'website' => null,
                'opening_hours' => 'Lunes a Viernes: 7:30 AM - 5:30 PM | Sábados: 8:00 AM - 3:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/repuestoselchinandegano',
                'instagram' => null,
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Panadería y Pastelería Artesanal Doña Haydée',
                'user_id' => $owner2->id,
                'city' => 'Managua',
                'categories' => ['Restaurantes y Cafeterías'],
                'short_description' => 'Pan caliente horneado a diario, tres leches, tortas temáticas personalizadas y café de origen.',
                'description' => 'Tradición pastelera desde 1994. Famosos por nuestro pastel tres leches de cuatro pisos, empanadas de piña, hojaldras y queques de boda y cumpleaños.',
                'address' => 'Reparto San Juan, Calle principal, Casa 12, Managua',
                'phone' => '+505 2278 1980',
                'whatsapp' => '+505 8788 3311',
                'email' => 'pedidos@pasteleriahaydee.com',
                'website' => 'https://pasteleriahaydee.com',
                'opening_hours' => 'Lunes a Sábado: 6:30 AM - 7:30 PM | Domingos: 8:00 AM - 2:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/pasteleriahaydeemanagua',
                'instagram' => 'https://instagram.com/pasteleriahaydee',
                'status' => 'approved',
                'featured' => true,
            ],
            [
                'name' => 'Salón & Spa Elegance Jinotepe',
                'user_id' => $owner->id,
                'city' => 'Jinotepe',
                'categories' => ['Belleza y Cuidado Personal'],
                'short_description' => 'Cortes de cabello vanguardistas, balayage, manicura acrílica, pedicura spa y faciales.',
                'description' => 'Centro de relajación y belleza integral en el centro de Jinotepe. Productos premium L’Oréal y Wella, personal certificado en cosmetología y masoterapia.',
                'address' => 'De la Parroquia Santiago 1c. al sur, Jinotepe, Carazo',
                'phone' => '+505 2532 1199',
                'whatsapp' => '+505 8990 4422',
                'email' => 'contacto@elegancejinotepe.com',
                'website' => null,
                'opening_hours' => 'Martes a Sábado: 9:00 AM - 6:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/elegancespajinotepe',
                'instagram' => 'https://instagram.com/elegancespajinotepe',
                'status' => 'approved',
                'featured' => false,
            ],
            [
                'name' => 'Academia de Idiomas & Negocios NicaGlobal',
                'user_id' => $owner2->id,
                'city' => 'Managua',
                'categories' => ['Educación y Academias', 'Servicios Profesionales'],
                'short_description' => 'Cursos de inglés comunicativo, preparación TOEFL/IELTS, francés e informática para profesionales.',
                'description' => 'Metodología 100% práctica con profesores nativos y certificados internacionalmente. Modalidades presenciales y virtuales en horarios flexibles para ejecutivos y estudiantes.',
                'address' => 'Villa Fontana, del Club Terraza 200 metros al sur, Managua',
                'phone' => '+505 2270 9944',
                'whatsapp' => '+505 8333 1188',
                'email' => 'info@nicaglobal.edu.ni',
                'website' => 'https://nicaglobal.edu.ni',
                'opening_hours' => 'Lunes a Viernes: 7:00 AM - 8:00 PM | Sábados: 8:00 AM - 4:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/nicaglobalidiomas',
                'instagram' => 'https://instagram.com/nicaglobalidiomas',
                'status' => 'approved',
                'featured' => false,
            ],
            // Additional pending / rejected businesses for test administration
            [
                'name' => 'Centro Fitness & CrossTraining Impacto',
                'user_id' => $owner->id,
                'city' => 'Managua',
                'categories' => ['Belleza y Cuidado Personal', 'Farmacias y Salud'],
                'short_description' => 'Gimnasio moderno con pesas libres, máquinas de última generación, crossfit y nutrición deportiva.',
                'description' => 'Entrenadores personales certificados, clases grupales de spinning, zumba y yoga. Registro en espera de verificación de permisos sanitarios por la administración.',
                'address' => 'Plaza La Fe, Módulo 8, Bello Horizonte, Managua',
                'phone' => '+505 2248 1020',
                'whatsapp' => '+505 8222 7744',
                'email' => 'gerencia@impactofitness.com.ni',
                'website' => 'https://impactofitness.com.ni',
                'opening_hours' => 'Lunes a Viernes: 5:00 AM - 9:00 PM | Sábados: 6:00 AM - 4:00 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/impactofitnessnica',
                'instagram' => 'https://instagram.com/impactofitnessnica',
                'status' => 'pending',
                'featured' => false,
            ],
            [
                'name' => 'Agencia Digital & Branding Creativo NicaPixel',
                'user_id' => $owner2->id,
                'city' => 'Granada',
                'categories' => ['Tecnología y Computación', 'Servicios Profesionales'],
                'short_description' => 'Diseño web, marketing en redes sociales, creación de contenido y publicidad digital.',
                'description' => 'Agencia joven enfocada en impulsar pequeñas y medianas empresas a través de identidad de marca sólida, sitios web rápidos y campañas publicitarias de alto retorno.',
                'address' => 'Calle El Tamarindo, Casa Colonial 44, Granada',
                'phone' => '+505 2552 9191',
                'whatsapp' => '+505 8484 9911',
                'email' => 'hola@nicapixel.com',
                'website' => 'https://nicapixel.com',
                'opening_hours' => 'Lunes a Viernes: 8:30 AM - 5:30 PM',
                'logo_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
                'facebook' => 'https://facebook.com/nicapixelagency',
                'instagram' => 'https://instagram.com/nicapixelagency',
                'status' => 'pending',
                'featured' => false,
            ],
            [
                'name' => 'Bar & Lounge La Clandestina Nocturna',
                'user_id' => $owner->id,
                'city' => 'Managua',
                'categories' => ['Restaurantes y Cafeterías'],
                'short_description' => 'Música en vivo y coctelería nocturna en el sector de Los Robles.',
                'description' => 'Establecimiento nocturno registrado con información incompleta y sin licencias correspondientes.',
                'address' => 'Zona Rosa, Managua',
                'phone' => '+505 8000 0000',
                'whatsapp' => null,
                'email' => 'contacto@laclandestina.com',
                'website' => null,
                'opening_hours' => 'Jueves a Domingo: 8:00 PM - 3:00 AM',
                'logo_path' => null,
                'facebook' => null,
                'instagram' => null,
                'status' => 'rejected',
                'admin_notes' => 'Rechazado: El negocio no aportó cédula RUC ni licencia de funcionamiento municipal requerida para locales de expendio nocturno.',
                'featured' => false,
            ],
        ];

        foreach ($businessesData as $bData) {
            $city = $cities[$bData['city']];
            $business = Business::create([
                'user_id' => $bData['user_id'],
                'city_id' => $city->id,
                'name' => $bData['name'],
                'slug' => Str::slug($bData['name']),
                'short_description' => $bData['short_description'],
                'description' => $bData['description'],
                'address' => $bData['address'],
                'phone' => $bData['phone'],
                'whatsapp' => $bData['whatsapp'],
                'email' => $bData['email'],
                'website' => $bData['website'],
                'opening_hours' => $bData['opening_hours'],
                'logo_path' => $bData['logo_path'],
                'facebook' => $bData['facebook'],
                'instagram' => $bData['instagram'],
                'status' => $bData['status'],
                'admin_notes' => $bData['admin_notes'] ?? null,
                'featured' => $bData['featured'] ?? false,
            ]);

            $catIds = [];
            foreach ($bData['categories'] as $catName) {
                if (isset($categories[$catName])) {
                    $catIds[] = $categories[$catName]->id;
                }
            }
            $business->categories()->sync($catIds);
        }
    }
}
