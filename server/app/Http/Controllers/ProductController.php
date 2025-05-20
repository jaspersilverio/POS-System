<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'sku' => 'required|string|unique:products',
            'price' => 'required|numeric',
            'stock' => 'required|integer'
        ]);

        return Product::create($validated);
    }

    public function show($id)
    {
        return Product::findOrfail($id);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrfail($id);
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
