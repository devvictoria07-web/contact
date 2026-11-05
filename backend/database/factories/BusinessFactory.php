<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\City;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Business>
 */
class BusinessFactory extends Factory
{
    protected $model = Business::class;

    public function definition(): array
    {
        $name = fake()->company();
        return [
            'user_id' => User::factory(),
            'city_id' => City::factory(),
            'name' => $name,
            'slug' => Str::slug($name . '-' . fake()->unique()->numberBetween(1, 9999)),
            'short_description' => fake()->sentence(10),
            'description' => fake()->paragraphs(2, true),
            'address' => fake()->streetAddress() . ', Managua, Nicaragua',
            'phone' => '+505 ' . fake()->numerify('#### ####'),
            'whatsapp' => '+505 ' . fake()->numerify('8### ####'),
            'email' => fake()->companyEmail(),
            'website' => 'https://' . Str::slug($name) . '.com.ni',
            'opening_hours' => 'Lunes a Viernes: 8:00 AM - 5:00 PM',
            'logo_path' => null,
            'facebook' => 'https://facebook.com/' . Str::slug($name),
            'instagram' => 'https://instagram.com/' . Str::slug($name),
            'status' => 'approved',
            'featured' => fake()->boolean(20),
        ];
    }
}

