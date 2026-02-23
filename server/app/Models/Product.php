<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'price',
        'sale_price',
        'brand',
        'category',
        'colour',
        'sizes',
        'in_stock',
    ];

    protected function casts(): array
    {
        return [
            'sizes' => 'array',
            'in_stock' => 'boolean',
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
        ];
    }

    public function savedProducts(): HasMany
    {
        return $this->hasMany(SavedProduct::class);
    }
}
