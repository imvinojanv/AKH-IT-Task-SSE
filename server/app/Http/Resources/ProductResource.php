<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $sizes = is_string($this->sizes) ? json_decode($this->sizes, true) : $this->sizes;

        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'brand' => $this->brand,
            'category' => $this->category,
            'colour' => $this->colour,
            'sizes' => $sizes,
            'price' => (float) $this->price,
            'sale_price' => $this->sale_price ? (float) $this->sale_price : null,
            'in_stock' => filter_var($this->in_stock, FILTER_VALIDATE_BOOLEAN),
        ];
    }
}
