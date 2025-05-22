<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\App\Http\Controllers\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:cashier,manager,admin' // para lang sa admin production
        ]);
        $user = User::create($validated);
        return response()->json(['token' => $user->createToken('API')->plainTextToken]);
    }
}
