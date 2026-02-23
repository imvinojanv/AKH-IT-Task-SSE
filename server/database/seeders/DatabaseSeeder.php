<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Execute the deterministic product generator to populate realistic exploratory API data
        // For development/demo purposes
        Artisan::call('products:generate', ['count' => 300]);
    }
}
