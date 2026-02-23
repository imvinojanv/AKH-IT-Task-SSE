<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class GenerateProductsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:generate {count=300 : The number of products to generate (max 1000)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate deterministic product data for development and demo purposes.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = min((int) $this->argument('count'), 1000);
        $faker = Faker::create();

        $brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance', 'Asics'];
        $categories = ['Shoes', 'T-Shirts', 'Jackets', 'Shorts', 'Accessories', 'Sportswear'];
        $colours = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Yellow', 'Navy'];

        $apparelSizes = ['S', 'M', 'L', 'XL'];
        $footwearSizes = ['40', '41', '42', '43', '44'];

        $this->components->info("Generating {$count} realistic products...");

        // Wipe existing products globally.
        // Because `saved_products` has "cascadeOnDelete()", Postgres automatically cleans up relations
        // cleanly and incredibly quickly without messy DB role truncation constraints.
        Product::query()->delete();

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $products = [];
        for ($i = 1; $i <= $count; $i++) {
            $brand = $faker->randomElement($brands);
            $category = $faker->randomElement($categories);
            $colour = $faker->randomElement($colours);

            $availableSizes = ($category === 'Shoes') ? $footwearSizes : $apparelSizes;
            $sizes = $faker->randomElements($availableSizes, $faker->numberBetween(1, count($availableSizes)));
            sort($sizes);

            $price = $faker->randomFloat(2, 20, 300);
            $salePrice = $faker->boolean(40) ? $faker->randomFloat(2, 5, $price - 0.01) : null;

            $adjectives = ['Pro', 'Elite', 'Essential', 'Classic', 'Performance', 'Training', 'Casual', 'Originals', 'Sport', 'Active'];
            $adjective = $faker->randomElement($adjectives);
            $name = "{$brand} {$adjective} {$category}";

            $brandPrefix = strtoupper(Str::slug($brand, ''));
            $paddedIndex = str_pad($i, 6, '0', STR_PAD_LEFT);
            $sku = "SKU-{$brandPrefix}-{$paddedIndex}";

            $products[] = [
                'name' => $name,
                'sku' => $sku,
                'price' => $price,
                'sale_price' => $salePrice,
                'brand' => $brand,
                'category' => $category,
                'colour' => $colour,
                'sizes' => json_encode($sizes),
                'in_stock' => $faker->boolean(70) ? 'true' : 'false',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $bar->advance();
        }

        foreach (array_chunk($products, 100) as $chunk) {
            Product::insert($chunk);
        }

        $bar->finish();
        $this->newLine(2);
        $this->components->info("Successfully seeded {$count} products for the Product Explorer.");
    }
}
