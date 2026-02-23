<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedProductApiTest extends TestCase
{
    use RefreshDatabase;

    private $userToken;
    private $testProduct;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userToken = 'TEST-TOKEN-' . uniqid();

        $this->testProduct = Product::create([
            'name' => 'Test Sneaker 3000',
            'sku' => 'SKU-SAVES-TEST',
            'brand' => 'Nike',
            'category' => 'Shoes',
            'colour' => 'Yellow',
            'price' => 199.99,
            'sizes' => json_encode(['40', '43']),
            'in_stock' => 'true',
        ]);
    }

    public function test_can_save_product_idempotently()
    {
        $response1 = $this->postJson('/api/saved', [
            'product_id' => $this->testProduct->id,
            'user_token' => $this->userToken
        ]);

        $response1->assertStatus(200)
                  ->assertJsonFragment([
                      'user_token' => $this->userToken,
                      'product_id' => $this->testProduct->id
                  ]);

        $this->assertDatabaseHas('saved_products', [
            'user_token' => $this->userToken,
            'product_id' => $this->testProduct->id
        ]);

        $response2 = $this->postJson('/api/saved', [
            'product_id' => $this->testProduct->id,
            'user_token' => $this->userToken
        ]);

        $response2->assertStatus(200);
        $this->assertDatabaseCount('saved_products', 1);
    }

    public function test_can_list_saved_products_for_user()
    {
        $this->postJson('/api/saved', [
            'product_id' => $this->testProduct->id,
            'user_token' => $this->userToken
        ]);

        $response = $this->getJson('/api/saved', [
            'X-User-Token' => $this->userToken
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'product_id',
                             'user_token',
                             'product' => ['id', 'name', 'sku']
                         ]
                     ]
                 ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($this->testProduct->id, $data[0]['product']['id']);
    }

    public function test_can_remove_saved_product_idempotently()
    {
        $this->postJson('/api/saved', [
            'product_id' => $this->testProduct->id,
            'user_token' => $this->userToken
        ]);

        $response = $this->deleteJson("/api/saved/{$this->testProduct->id}", [], [
            'X-User-Token' => $this->userToken
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Product removed from saved list']);

        $this->assertDatabaseMissing('saved_products', [
            'user_token' => $this->userToken,
            'product_id' => $this->testProduct->id
        ]);

        $response2 = $this->deleteJson("/api/saved/{$this->testProduct->id}", [], [
            'X-User-Token' => $this->userToken
        ]);

        $response2->assertStatus(200);
    }
}
