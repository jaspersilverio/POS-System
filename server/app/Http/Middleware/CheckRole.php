<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role = null): Response
    {
        // If no role is required or user is not authenticated, just continue
        if (!$role || !$request->user()) {
            return $next($request);
        }
        
        $roles = [
            'admin' => 3,
            'manager' => 2,
            'cashier' => 1
        ];
        
        $userRole = $request->user()->role;
        
        // Log role check for debugging
        \Log::info("Role check: User role: {$userRole}, Required role: {$role}");
        
        // Check if user has at least the required role level
        if (!isset($roles[$userRole]) || !isset($roles[$role]) || $roles[$userRole] < $roles[$role]) {
            return response()->json([
                'message' => 'Unauthorized. You do not have the required permissions.'
            ], 403);
        }
        
        return $next($request);
    }
}
