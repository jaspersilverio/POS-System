<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:55',
            'last_name' => 'required|string|max:55',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:admin,manager,cashier',
            'age' => 'required|integer|min:18',
            'birth_date' => 'required|date',
            // REMOVE 'gender_id' => 'required|exists:genders,id',
            'address' => 'required|string',
            'contact_number' => 'required|string|max:20'
        ]);

        // Create user without gender
        $user = User::create($validated);

        return response()->json([
            'token' => $user->createToken('POS-TOKEN')->plainTextToken,
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'min:8',
            'max:15'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials, please try again'], 401);
        }

        $user = User::where('email', $request->email)->first();

        return response()->json([
            'token' => $user->createToken('POS-TOKEN')->plainTextToken,
            'role' => $user->role,
            'name' => $user->first_name
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
