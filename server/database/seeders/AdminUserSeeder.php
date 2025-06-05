<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
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
    }
}
