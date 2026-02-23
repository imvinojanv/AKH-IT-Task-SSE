<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductExplorerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_paginated_products_with_facets()
    {
        Product::create([
            'name' => 'Nike Air Max',
            'sku' => 'SKU-TEST-001',
            'brand' => 'Nike',
            'category' => 'Shoes',
            'colour' => 'Red',
            'price' => 120.00,
            'sizes' => json_encode(['40', '41', '42']),
            'in_stock' => 'true',
        ]);

        Product::create([
            'name' => 'Adidas Ultraboost',
            'sku' => 'SKU-TEST-002',
            'brand' => 'Adidas',
            'category' => 'Shoes',
            'colour' => 'Black',
            'price' => 180.00,
            'sizes' => json_encode(['42', '43']),
            'in_stock' => 'true',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'sku', 'brand', 'price', 'in_stock']
                     ],
                     'meta' => ['current_page', 'last_page', 'total'],
                     'facets' => ['brand', 'category', 'colour']
                 ]);

        $facets = $response->json('facets');
        $this->assertGreaterThanOrEqual(1, $facets['brand']['Nike']);
        $this->assertGreaterThanOrEqual(1, $facets['brand']['Adidas']);
    }

    public function test_can_filter_products_by_search_query()
    {
        Product::create([
            'name' => 'Puma RS-X',
            'sku' => 'SKU-TEST-003',
            'brand' => 'Puma',
            'category' => 'Shoes',
            'colour' => 'White',
            'price' => 100.00,
            'sizes' => json_encode(['40', '41']),
            'in_stock' => 'true',
        ]);

        $response = $this->getJson('/api/products?search=Puma');

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $product) {
            $matched = stripos($product['name'], 'Puma') !== false ||
                       stripos($product['sku'], 'Puma') !== false ||
                       stripos($product['brand'], 'Puma') !== false;
            $this->assertTrue($matched, 'A product was returned that did not match the search query.');
        }
    }
}
