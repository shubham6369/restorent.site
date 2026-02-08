'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle2, Truck, Clock, Timer } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            // Handle Demo Orders
            if (orderId.startsWith('demo-')) {
                setTimeout(() => {
                    setOrder({
                        id: orderId,
                        orderStatus: 'preparing', // mock status
                        tableNumber: '5',
                        totalAmount: 1250,
                        createdAt: new Date(),
                        items: [{ name: 'Classic Margherita Pizza', quantity: 1 }]
                    });
                    setLoading(false);
                }, 800);
                return;
            }

            if (!db) {
                setError('Database connection unavailable. Try a demo order ID (starting with "demo-").');
                setLoading(false);
                return;
            }

            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (orderSnap.exists()) {
                setOrder({ id: orderSnap.id, ...orderSnap.data() });
            } else {
                setError('Order not found. Please check your Order ID.');
            }
        } catch (err) {
            console.error('Track error:', err);
            setError('Failed to fetch order details.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { status: 'new', label: 'Order Received', icon: Package },
        { status: 'preparing', label: 'In the Kitchen', icon: Timer },
        { status: 'ready', label: 'Ready to Serve', icon: CheckCircle2 },
        { status: 'delivered', label: 'Served / Delivered', icon: Truck },
    ];

    const currentStepIndex = order ? steps.findIndex(s => s.status === order.orderStatus) : -1;

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
                    <p className="text-gray-600 font-medium">Enter your order ID to see real-time updates from our kitchen.</p>
                </div>

                {/* Track Input */}
                <form onSubmit={handleTrack} className="mb-12">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Enter Order ID (e.g. demo-123)"
                            className="w-full px-8 py-6 rounded-[2rem] bg-white shadow-xl text-xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all group-hover:shadow-2xl"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-4 top-4 bg-orange-500 text-white p-3 rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <Search size={24} />}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center font-bold animate-shake uppercase tracking-tight">
                        {error}
                    </div>
                )}

                {order && (
                    <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b pb-8 border-gray-100">
                            <div>
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Order Status</h3>
                                <div className="text-3xl font-black text-gray-900">{steps[currentStepIndex]?.label || 'Updating...'}</div>
                            </div>
                            <div className="bg-orange-50 px-6 py-3 rounded-2xl">
                                <span className="text-orange-600 font-bold">Order ID: </span>
                                <span className="font-mono font-bold text-gray-800">{order.id}</span>
                            </div>
                        </div>

                        {/* Visual Progress Tracker */}
                        <div className="relative mb-16 px-4">
                            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1.5 bg-orange-500 -translate-y-1/2 transition-all duration-1000 ease-out"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            ></div>

                            <div className="relative flex justify-between">
                                {steps.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isActive = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${isActive ? 'bg-orange-500 text-white shadow-lg' : 'bg-white border-4 border-gray-100 text-gray-400'
                                                } ${isCurrent ? 'scale-125 ring-8 ring-orange-500/10' : ''}`}>
                                                <Icon size={24} />
                                            </div>
                                            <span className={`mt-4 font-bold text-sm whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
                            <div>
                                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                                    <Clock size={20} className="text-orange-500" /> Order Details
                                </h4>
                                <div className="space-y-3">
                                    {order.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-gray-600 font-medium">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-dashed flex justify-between font-bold text-lg text-gray-900">
                                        <span>Total Paid</span>
                                        <span className="text-orange-600">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-3xl">
                                    <h4 className="font-bold mb-2">Need Help?</h4>
                                    <p className="text-gray-500 text-sm mb-4">Contact our support if you have any questions about your order.</p>
                                    <a href="https://wa.me/917366032884" className="text-orange-600 font-bold hover:underline">Chat with Support →</a>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed">
                                    * Real-time tracking is estimated. Preparation times may vary during peak hours.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
