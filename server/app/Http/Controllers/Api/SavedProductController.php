<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveProductRequest;
use App\Http\Resources\SavedProductResource;
use App\Models\SavedProduct;
use Illuminate\Http\Request;

class SavedProductController extends Controller
{
    private function getUserToken(Request $request): ?string
    {
        return $request->header('X-User-Token') ?? $request->input('user_token');
    }

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

        return SavedProductResource::collection($savedProducts);
    }

    public function store(SaveProductRequest $request)
    {
        $validated = $request->validated();

        // Use the validated data. Override if userToken was actually mapped from headers.
        $userToken = $validated['user_token'];

        $savedObject = SavedProduct::firstOrCreate([
            'user_token' => $userToken,
            'product_id' => $validated['product_id']
        ]);

        return new SavedProductResource($savedObject);
    }

    public function destroy(Request $request, $productId)
    {
        $userToken = $this->getUserToken($request);

        if (!$userToken) {
            return response()->json(['message' => 'User token is required either in X-User-Token header or user_token parameter.'], 400);
        }

        SavedProduct::where('user_token', $userToken)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Product removed from saved list']);
    }
}
