<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function index()
    {
        $orders = Order::with(['owner', 'orderItems.book'])
            ->latest()
            ->get();
        
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load('owner', 'orderItems.book');
        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled',
        ]);
        
        $order->update($validated);
        
        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    // Deleting orders might not be typical, but you can add it if required
    // public function destroy(Order $order)
    // {
    //     $order->delete();
    //     return redirect()->back()->with('success', 'Order deleted successfully.');
    // }
} 