<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'cashier',
            // Add other required fields
        ]);

        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@dripline.com',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'age' => 25,
            'birth_date' => '1999-01-01',
            'address' => 'System Address',
            'contact_number' => '09123456789'
        ]);

        $this->call([
            AdminUserSeeder::class,
            // ProductSeeder::class, // if you want to seed products
        ]);
    }
}
