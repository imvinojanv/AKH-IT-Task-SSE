<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // 1. Search Query
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                // 'ilike' ensures case-insensitive matching for PostgreSQL
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('brand', 'ilike', "%{$search}%");
            });
        }

        // 2. Exact Match Filters
        if ($request->has('brand') && $request->input('brand') !== '') {
            $query->whereIn('brand', (array) $request->input('brand'));
        }
        if ($request->has('category') && $request->input('category') !== '') {
            $query->whereIn('category', (array) $request->input('category'));
        }
        if ($request->has('colour') && $request->input('colour') !== '') {
            $query->whereIn('colour', (array) $request->input('colour'));
        }
        if ($request->has('in_stock') && $request->input('in_stock') !== '') {
            $inStock = filter_var($request->input('in_stock'), FILTER_VALIDATE_BOOLEAN);
            $query->where('in_stock', $inStock ? 'true' : 'false');
        }

        // 3. Construct Facets efficiently using 3 targeted aggregations
        // We clone the pre-filtered query to ensure facets respect current filters dynamically.
        $brandFacets = (clone $query)->select('brand as key', DB::raw('count(*) as count'))->groupBy('brand')->pluck('count', 'key');
        $categoryFacets = (clone $query)->select('category as key', DB::raw('count(*) as count'))->groupBy('category')->pluck('count', 'key');
        $colourFacets = (clone $query)->select('colour as key', DB::raw('count(*) as count'))->groupBy('colour')->pluck('count', 'key');

        $facets = [
            'brand' => $brandFacets,
            'category' => $categoryFacets,
            'colour' => $colourFacets,
        ];

        // 4. Sorting logic
        $sort = $request->input('sort', 'name_asc');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'name_asc':
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        // Add deterministic fallback sort for predictable pagination
        $query->orderBy('id', 'asc');

        // 5. Apply Pagination seamlessly
        $perPage = min((int) $request->input('per_page', 12), 50);
        $perPage = $perPage > 0 ? $perPage : 12;

        $products = $query->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
            'facets' => $facets,
        ]);
    }
}
