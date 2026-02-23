<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedProduct;
use Illuminate\Http\Request;

class SavedProductController extends Controller
{
    /**
     * Retrieve the user token from header or input payload.
     */
    private function getUserToken(Request $request): ?string
    {
        return $request->header('X-User-Token') ?? $request->input('user_token');
    }

    /**
     * GET /api/saved
     * Retrieve all saved products for a user.
     */
    public function index(Request $request)
    {
        $userToken = $this->getUserToken($request);

        if (!$userToken) {
            return response()->json(['message' => 'User token is required either in X-User-Token header or user_token parameter.'], 400);
        }

        $savedProducts = SavedProduct::with('product')
            ->where('user_token', $userToken)
            ->latest()
            ->get();

        return response()->json([
            'data' => $savedProducts
        ]);
    }

    /**
     * POST /api/saved
     * Save a product for a user idempotently.
     */
    public function store(Request $request)
    {
        $userToken = $this->getUserToken($request);

        if (!$userToken) {
            return response()->json(['message' => 'User token is required either in X-User-Token header or user_token parameter.'], 400);
        }

        // Validate that the product exists in the DB
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Idempotent insertion logic (Prevents duplicates safely)
        $savedProduct = SavedProduct::firstOrCreate([
            'user_token' => $userToken,
            'product_id' => $validated['product_id'],
        ]);

        // Load full product context exactly as requested
        $savedProduct->load('product');

        return response()->json([
            'data' => $savedProduct
        ]);
    }

    /**
     * DELETE /api/saved/{product_id}
     * Remove a saved product idempotently.
     */
    public function destroy(Request $request, $product_id)
    {
        $userToken = $this->getUserToken($request);

        if (!$userToken) {
            return response()->json(['message' => 'User token is required either in X-User-Token header or user_token parameter.'], 400);
        }

        // Idempotent delete: if it exists, discard it. If not, it still counts as a success.
        SavedProduct::where('user_token', $userToken)
            ->where('product_id', $product_id)
            ->delete();

        return response()->json([
            'message' => 'Product removed from saved list'
        ]);
    }
}
