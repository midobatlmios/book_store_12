<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
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
        } else {
            $cartIds = session('carts', []);
            $carts = Cart::with('bookOwner')
                ->whereIn('id', $cartIds)
                ->withoutCheckout()
                ->get();
        }
        
        return inertia('Checkout/Index', [
            'carts' => $carts,
            'addresses' => Auth::user()->addresses()->orderBy('default', 'asc')->get(),
            'countries' => Country::all()
        ]);
    }
}
