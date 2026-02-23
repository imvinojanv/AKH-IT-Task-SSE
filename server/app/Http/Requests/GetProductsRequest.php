<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetProductsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:100',
            'brand' => 'nullable|array',
            'brand.*' => 'string|max:50',
            'category' => 'nullable|array',
            'category.*' => 'string|max:50',
            'colour' => 'nullable|array',
            'colour.*' => 'string|max:50',
            'in_stock' => 'nullable|in:true,false,1,0',
            'sort' => 'nullable|in:name_asc,name_desc,price_asc,price_desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
