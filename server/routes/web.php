<?php

use Illuminate\Support\Facades\Route;

Route::get('/register', function () {
    return view('auth.register');
});
Route::get('/', function () {
    return view('welcome');
});
