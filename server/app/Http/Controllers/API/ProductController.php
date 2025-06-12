<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('inventory')->get();

        return response()->json([
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // To prevent header issues, make sure nothing is output before this point
        ob_start();

        try {
            // Log the incoming request for debugging
            Log::info('Product creation request:', $request->all());

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'sku' => 'required|string|unique:products',
                'category' => 'required|string|max:100',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'active' => 'sometimes|boolean',
                'quantity' => 'sometimes|integer|min:0',
                'min_stock_level' => 'sometimes|integer|min:1',
            ]);

            if ($validator->fails()) {
                Log::warning('Validation failed:', $validator->errors()->toArray());
                ob_end_clean();
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'sku' => $request->sku,
                'category' => $request->category,
                'image' => $request->hasFile('image') ? $request->file('image')->store('products', 'public') : null,
                'active' => $request->active ?? true,
            ]);

            Log::info('Product created with ID: ' . $product->id);

            // Create inventory record if quantity provided
            if ($request->has('quantity')) {
                $inventory = Inventory::create([
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'min_stock_level' => $request->min_stock_level ?? 10,
                    'last_restock_date' => now(),
                ]);
                Log::info('Inventory created with ID: ' . $inventory->id);
            }

            // Return response and make sure buffer is flushed properly
            $response = response()->json([
                'message' => 'Product created successfully',
                'product' => $product->load('inventory')
            ], 201);

            // Clean output buffer
            ob_end_clean();

            return $response;
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error creating product: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // Clean output buffer
            ob_end_clean();

            return response()->json([
                'message' => 'An error occurred while creating the product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('inventory')->findOrFail($id);

        return response()->json([
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'sku' => 'sometimes|string|unique:products,sku,' . $id,
            'category' => 'sometimes|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'active' => 'sometimes|boolean',
            'quantity' => 'sometimes|integer|min:0',
            'min_stock_level' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'name',
            'description',
            'price',
            'sku',
            'category',
            'active'
        ]);
        if ($request->hasFile('image')) {
            $updateData['image'] = $request->file('image')->store('products', 'public');
        }
        $product->update($updateData);

        // Update inventory if quantity provided
        if ($request->has('quantity') || $request->has('min_stock_level')) {
            $inventory = $product->inventory ?? new Inventory(['product_id' => $product->id]);

            if ($request->has('quantity')) {
                $inventory->quantity = $request->quantity;
                if ($inventory->wasRecentlyCreated) {
                    $inventory->last_restock_date = now();
                }
            }

            if ($request->has('min_stock_level')) {
                $inventory->min_stock_level = $request->min_stock_level;
            }

            $inventory->save();
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('inventory')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
