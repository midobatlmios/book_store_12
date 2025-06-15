<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AddressDefaultController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [IndexController::class, 'index']);

Route::resource('book', BookController::class)->only(['index', 'show']);

Route::resource('cart', CartController::class)->only(['index', 'store', 'update', 'destroy']);

Route::get('/payment-return', [PaymentController::class, 'index'])->name('payment.index');
Route::post('/payment-callback', [PaymentController::class, 'update'])->name('payment.update');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('address', AddressController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::name('address.default')->put('address/{address}/default', AddressDefaultController::class);

    Route::resource('checkout', CheckoutController::class)->only(['index']);

    Route::resource('order', OrderController::class)->only(['index', 'store', 'show', 'update']);
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');

    // Book Management
    Route::get('/books', [App\Http\Controllers\Admin\BookController::class, 'index'])->name('books.index');
    Route::post('/books', [App\Http\Controllers\Admin\BookController::class, 'store'])->name('books.store');
    Route::get('/books/{book}', [App\Http\Controllers\Admin\BookController::class, 'show'])->name('books.show');
    Route::put('/books/{book}', [App\Http\Controllers\Admin\BookController::class, 'update'])->name('books.update');
    Route::delete('/books/{book}', [App\Http\Controllers\Admin\BookController::class, 'destroy'])->name('books.destroy');

    // Order Management
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
});

require __DIR__ . '/auth.php';
