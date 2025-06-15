import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import OrderList from './OrderList';

export default function Index({ orders }) {
    return (
        <AdminLayout>
            <Head title="Order Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Order Management</h2>
                                {/* No "Add New Order" button for now, as orders are usually created through the checkout process */}
                            </div>

                            <OrderList orders={orders} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 