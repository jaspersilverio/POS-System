<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Check if user has a specific role
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
    
    /**
     * Check if user is an admin
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }
    
    /**
     * Check if user is a manager
     *
     * @return bool
     */
    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }
    
    /**
     * Check if user is a cashier
     *
     * @return bool
     */
    public function isCashier(): bool
    {
        return $this->hasRole('cashier');
    }
    
    /**
     * Get the transactions processed by this user.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
