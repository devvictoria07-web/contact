<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<City>
 */
class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        $name = fake()->city();
        $department = fake()->state();
        return [
            'name' => $name,
            'department' => $department,
            'slug' => Str::slug($name . '-' . $department . '-' . fake()->unique()->numberBetween(1, 9999)),
        ];
    }
}

