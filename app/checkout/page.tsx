'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, MinusCircle, PlusCircle, CreditCard, Wallet, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
    const { user } = useAuth();
    const [tableNumber, setTableNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('cash');
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        // Load table number from localStorage
        const savedTable = localStorage.getItem('tableNumber');
        if (savedTable) {
            setTableNumber(savedTable);
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const totalPrice = getTotalPrice();

    const createOrder = async (paymentId?: string, razorpayOrderId?: string) => {
        const orderData = {
            items: cart.map((item) => ({
                menuItemId: item.menuItem.id,
                name: item.menuItem.name,
                price: item.menuItem.price,
                quantity: item.quantity,
            })),
            tableNumber,
            totalAmount: totalPrice,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'paid',
            orderStatus: 'new',
            userId: user?.uid || null,
            ...(razorpayOrderId && { razorpayOrderId }),
            ...(paymentId && { razorpayPaymentId: paymentId }),
            createdAt: new Date(), // Local date for demo
            updatedAt: new Date(),
        };

        if (!db) {
            console.log('Demo Mode: Order created', orderData);
            return 'demo-order-' + Math.random().toString(36).substr(2, 9);
        }

        try {
            const docRef = await addDoc(collection(db, 'orders'), {
                ...orderData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const handleRazorpayPayment = async () => {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            // Demo mode: skip razorpay and simulate success
            setLoading(true);
            setTimeout(async () => {
                const orderId = await createOrder('demo-pay-' + Math.random().toString(36).substr(2, 9), 'demo-rzp-' + Math.random().toString(36).substr(2, 9));
                clearCart();
                toast.success('Demo Mode: Payment simulated successfully!');
                router.push(`/order-success?orderId=${orderId}&tableNumber=${tableNumber}`);
                setLoading(false);
            }, 1500);
            return;
        }

        if (!razorpayLoaded) {
            toast.error('Payment gateway is loading. Please try again.');
            return;
        }

        try {
            setLoading(true);

            // Create Razorpay order
            const response = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice }),
            });

            const data = await response.json();

            if (!data.orderId) {
                throw new Error('Failed to create payment order');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: totalPrice * 100, // Razorpay expects amount in paise
                currency: 'INR',
                name: 'TasteHub Restaurant',
                description: `Table ${tableNumber} - Order Payment`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.verified) {
                            // Create order in database
                            const orderId = await createOrder(
                                response.razorpay_payment_id,
                                response.razorpay_order_id
                            );

                            clearCart();
                            toast.success('Payment successful! Order placed.');
                            router.push(`/order-success?orderId=${orderId}&tableNumber=${tableNumber}`);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment handler error:', error);
                        toast.error('Failed to process payment');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: `Table ${tableNumber}`,
                },
                theme: {
                    color: '#f97316',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.error('Payment cancelled');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment');
            setLoading(false);
        }
    };

    const handleCashPayment = async () => {
        try {
            setLoading(true);
            const orderId = await createOrder();
            clearCart();
            toast.success('Order placed! Please pay at the counter.');
            router.push(`/order-success?orderId=${orderId}&tableNumber=${tableNumber}`);
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tableNumber.trim()) {
            toast.error('Please enter your table number');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (paymentMethod === 'cash') {
            await handleCashPayment();
        } else {
            await handleRazorpayPayment();
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">Your Order</h2>

                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.menuItem.id}
                                        className="flex gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <div className="relative w-20 h-20 bg-orange-100 rounded-lg flex-shrink-0">
                                            {item.menuItem.image ? (
                                                <Image
                                                    src={item.menuItem.image}
                                                    alt={item.menuItem.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-2xl">
                                                    🍽️
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.menuItem.name}</h3>
                                            <p className="text-gray-600">₹{item.menuItem.price}</p>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeFromCart(item.menuItem.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.menuItem.id, item.quantity - 1)
                                                    }
                                                    className="text-orange-500 hover:text-orange-600"
                                                >
                                                    <MinusCircle size={24} />
                                                </button>
                                                <span className="font-bold text-lg w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.menuItem.id, item.quantity + 1)
                                                    }
                                                    className="text-orange-500 hover:text-orange-600"
                                                >
                                                    <PlusCircle size={24} />
                                                </button>
                                            </div>

                                            <p className="font-bold text-orange-600">
                                                ₹{item.menuItem.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Payment */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                            {/* Table Number */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">
                                    Table Number *
                                </label>
                                <input
                                    type="text"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    placeholder="Enter table number"
                                    required
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3">
                                    Payment Method *
                                </label>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${paymentMethod === 'upi'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <Wallet size={24} />
                                        <span className="font-semibold">UPI / Net Banking</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <CreditCard size={24} />
                                        <span className="font-semibold">Credit / Debit Card</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${paymentMethod === 'cash'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <Banknote size={24} />
                                        <span className="font-semibold">Pay at Counter</span>
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t-2 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-orange-600">₹{totalPrice}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                        Processing...
                                    </span>
                                ) : paymentMethod === 'cash' ? (
                                    'Place Order'
                                ) : (
                                    `Pay ₹${totalPrice}`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
