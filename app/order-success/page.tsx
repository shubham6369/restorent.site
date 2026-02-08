'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, UtensilsCrossed } from 'lucide-react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [tableNumber, setTableNumber] = useState('');

    useEffect(() => {
        const id = searchParams.get('orderId');
        const table = searchParams.get('tableNumber');

        if (id) setOrderId(id);
        if (table) setTableNumber(table);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Success Animation */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6">
                                <CheckCircle className="text-white" size={64} />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Your delicious food will be served shortly
                    </p>

                    {/* Order Details */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <UtensilsCrossed className="text-orange-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                <p className="font-mono font-bold text-gray-800 break-all">
                                    {orderId || 'Loading...'}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Table Number</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {tableNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8 text-left">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Please keep this order ID for reference.
                            Our kitchen has been notified and your order is being prepared.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Back to Menu
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('tableNumber');
                                router.push('/');
                            }}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
                        >
                            Start New Order
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Thank you for ordering with TasteHub! 🎉
                </p>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
