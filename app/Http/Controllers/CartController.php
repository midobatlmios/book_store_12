<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()) {
            $carts = Auth::user()->carts()
                ->with('bookOwner')
                ->withoutCheckout()
                ->get();

            \Log::info('Authenticated user cart data:', [
                'user_id' => Auth::id(),
                'carts_count' => $carts->count(),
                'carts' => $carts->toArray()
            ]);
        } else {
            $cartIds = session('carts', []);
            $carts = Cart::with('bookOwner')
                ->whereIn('id', $cartIds)
                ->withoutCheckout()
                ->get();

            \Log::info('Guest user cart data:', [
                'session_cart_ids' => $cartIds,
                'carts_count' => $carts->count(),
                'carts' => $carts->toArray()
            ]);
        }

        // Debug the final data being sent to the view
        \Log::info('Final cart data being sent to view:', [
            'is_authenticated' => Auth::check(),
            'carts_count' => $carts->count(),
            'carts' => $carts->toArray()
        ]);
        
        return inertia('Cart/Index', [
            'carts' => $carts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $bookId = $request->input('bookId');
        $bookQuantity = $request->input('bookQuantity');

        \Log::info('Adding to cart:', [
            'book_id' => $bookId,
            'quantity' => $bookQuantity,
            'is_authenticated' => Auth::check(),
            'session_carts' => session('carts', [])
        ]);

        if ($request->user()) {
            $cart = $request->user()->carts()->where('book_id', '=', $bookId)->withoutCheckout()->first();

            if ($cart) {
                $newQuantity = $cart->quantity + $bookQuantity;
                $cart->update(['quantity' => $newQuantity]);
                \Log::info('Updated existing cart:', ['cart_id' => $cart->id, 'new_quantity' => $newQuantity]);
            } else {
                $cart = Book::find($bookId)->carts()->save(
                    Cart::make(
                        ['quantity' => $bookQuantity]
                    )->userOwner()->associate($request->user())
                );
                \Log::info('Created new cart for user:', ['cart_id' => $cart->id]);
            }
        } else {
            if ($request->session()->has('carts')) {
                $cartIds = $request->session()->get('carts');

                $cart = Cart::whereIn('id', $cartIds)->where('book_id', '=', $bookId)->withoutCheckout()->first();

                if ($cart) {
                    $newQuantity = $cart->quantity + $bookQuantity;
                    $cart->update(['quantity' => $newQuantity]);
                    \Log::info('Updated existing guest cart:', ['cart_id' => $cart->id, 'new_quantity' => $newQuantity]);
                } else {
                    $cart = Book::find($bookId)->carts()->create(['quantity' => $bookQuantity]);
                    $cartIds[] = $cart->id;
                    $request->session()->put('carts', $cartIds);
                    \Log::info('Created new guest cart:', ['cart_id' => $cart->id, 'session_carts' => $cartIds]);
                }
            } else {
                $cart = Book::find($bookId)->carts()->create(['quantity' => $bookQuantity]);
                $request->session()->put('carts', [$cart->id]);
                \Log::info('Created first guest cart:', ['cart_id' => $cart->id]);
            }
        }

        // Get updated cart data
        if ($request->user()) {
            $carts = $request->user()->carts()
                ->with('bookOwner')
                ->withoutCheckout()
                ->get();
        } else {
            $cartIds = session('carts', []);
            $carts = Cart::with('bookOwner')
                ->whereIn('id', $cartIds)
                ->withoutCheckout()
                ->get();
        }

        return back()->with('carts', $carts);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        $bookQuantity = $request->input('bookQuantity');

        if ($bookQuantity > 0) {
            $cart->update(['quantity' => $bookQuantity]);
        } else {
            if (!$request->user()) {
                $cartIds = $request->session()->get('carts', []);
                if (($key = array_search($cart->id, $cartIds)) !== false) {
                    unset($cartIds[$key]);
                    $request->session()->put('carts', array_values($cartIds));
                }
            }
            $cart->deleteOrFail();
        }

        // Get updated cart data
        if ($request->user()) {
            $carts = $request->user()->carts()
                ->with('bookOwner')
                ->withoutCheckout()
                ->get();
        } else {
            $cartIds = session('carts', []);
            $carts = Cart::with('bookOwner')
                ->whereIn('id', $cartIds)
                ->withoutCheckout()
                ->get();
        }

        return back()->with('carts', $carts);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Cart $cart)
    {
        if (!$request->user()) {
            $cartIds = session('carts', []);
            if (($key = array_search($cart->id, $cartIds)) !== false) {
                unset($cartIds[$key]);
                session(['carts' => array_values($cartIds)]);
            }
        }

        $cart->deleteOrFail();

        // Get updated cart data
        if ($request->user()) {
            $carts = $request->user()->carts()
                ->with('bookOwner')
                ->withoutCheckout()
                ->get();
        } else {
            $cartIds = session('carts', []);
            $carts = Cart::with('bookOwner')
                ->whereIn('id', $cartIds)
                ->withoutCheckout()
                ->get();
        }

        return back()->with('carts', $carts);
    }
}
