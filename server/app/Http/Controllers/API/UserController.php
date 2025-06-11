<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of all users
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();
        
        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Store a newly created user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required', 
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'role' => 'required|in:admin,manager,cashier',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'role', 'created_at')
            ->findOrFail($id);
        
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Update the specified user
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Base validation rules
        $rules = [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|required|in:admin,manager,cashier',
        ];
        
        // Only validate password if it's provided and not empty
        if ($request->filled('password')) {
            $rules['password'] = [
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ];
        }
        
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user data
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        // Only update password if it's provided and not empty
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        if ($request->has('role')) {
            $user->role = $request->role;
        }
        
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Don't allow deleting yourself
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 400);
        }
        
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
} 