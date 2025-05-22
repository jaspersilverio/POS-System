<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Clear existing data
        Product::truncate();

        // Add sample clothing products
        $products = [
            [
                'name' => 'Floral Summer Dress',
                'sku' => 'FSD-001',
                'price' => 1299.99,
                'stock' => 25,
                'variants' => [
                    'sizes' => ['S', 'M', 'L'],
                    'colors' => ['Red', 'Blue', 'White']
                ],
                'category' => 'Dresses'
            ],
            [
                'name' => 'Denim Jacket',
                'sku' => 'DJ-002',
                'price' => 1999.99,
                'stock' => 15,
                'variants' => [
                    'sizes' => ['S', 'M', 'L', 'XL'],
                    'colors' => ['Blue', 'Black']
                ],
                'category' => 'Jackets'
            ]
        ];

        foreach ($products as $product) {
            Product::create([
                ...$product,
                'variants' => json_encode($product['variants']) // Convert to JSON
            ]);
        }
    }
}
