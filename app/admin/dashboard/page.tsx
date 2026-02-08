'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    where,
    limit,
} from 'firebase/firestore';
import { Order } from '@/types';
import { LogOut, Bell, Clock, ChefHat, CheckCircle, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<'all' | 'new' | 'preparing' | 'served'>('all');
    const [audioEnabled, setAudioEnabled] = useState(true);

    // Auth check
    useEffect(() => {
        if (!auth) {
            // Demo mode: set a mock admin user
            setUser({ email: 'admin@demo.com', displayName: 'Demo Admin' });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                router.push('/admin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Real-time orders listener
    useEffect(() => {
        if (!user) return;

        if (!db) {
            // Demo mode: provide mock orders
            const mockOrders: Order[] = [
                {
                    id: 'demo-order-1',
                    items: [{ menuItemId: '1', name: 'Classic Margherita', price: 299, quantity: 1 }],
                    tableNumber: '5',
                    totalAmount: 299,
                    paymentMethod: 'upi',
                    paymentStatus: 'paid',
                    orderStatus: 'new',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'demo-order-2',
                    items: [{ menuItemId: '2', name: 'Veg Supreme Pizza', price: 449, quantity: 2 }],
                    tableNumber: '12',
                    totalAmount: 898,
                    paymentMethod: 'cash',
                    paymentStatus: 'unpaid',
                    orderStatus: 'preparing',
                    createdAt: new Date(Date.now() - 1000 * 60 * 15),
                    updatedAt: new Date(),
                }
            ];
            setOrders(mockOrders);
            setLoading(false);
            return;
        }

        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData: Order[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    ordersData.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    } as Order);
                });

                if (orders.length > 0 && ordersData.length > orders.length && audioEnabled) {
                    playNotificationSound();
                    toast.success('New order received!', { icon: '🔔', duration: 5000 });
                }

                setOrders(ordersData);
            },
            (error) => {
                console.error('Error fetching orders:', error);
                toast.error('Failed to fetch orders');
            }
        );

        return () => unsubscribe();
    }, [user, orders.length, audioEnabled]);

    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((e) => console.log('Audio play failed:', e));
    };

    const handleLogout = async () => {
        try {
            if (auth) await signOut(auth);
            toast.success('Logged out successfully');
            router.push('/admin');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
        if (!db) {
            // Local update for demo
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
            toast.success(`Order status updated to ${newStatus}`);
            return;
        }
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                orderStatus: newStatus,
                updatedAt: new Date(),
            });
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.orderStatus === filter);

    const getStatusColor = (status: Order['orderStatus']) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'served':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPaymentStatusColor = (status: Order['paymentStatus']) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-lg sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Kitchen Dashboard
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Logged in as: {user?.email}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Audio Toggle */}
                            <button
                                onClick={() => setAudioEnabled(!audioEnabled)}
                                className={`p-3 rounded-full transition-colors ${audioEnabled
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                title={audioEnabled ? 'Sound On' : 'Sound Off'}
                            >
                                <Bell size={20} />
                            </button>

                            {/* Menu Management */}
                            <button
                                onClick={() => router.push('/admin/menu')}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold"
                            >
                                <Settings size={20} />
                                Manage Menu
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Clock className="text-blue-600" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">New Orders</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {orders.filter(o => o.orderStatus === 'new').length}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Bell className="text-blue-600" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Preparing</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {orders.filter(o => o.orderStatus === 'preparing').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-full">
                                <ChefHat className="text-yellow-600" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Served</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {orders.filter(o => o.orderStatus === 'served').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="text-green-600" size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto">
                        {(['all', 'new', 'preparing', 'served'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${filter === status
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-2xl text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        {/* Order Info */}
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    Table {order.tableNumber}
                                                </h3>
                                                <span className={`px-4 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus.toUpperCase()}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Order ID: <span className="font-mono">{order.id}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {format(order.createdAt, 'MMM dd, yyyy hh:mm a')}
                                            </p>
                                        </div>

                                        {/* Total Amount */}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                            <p className="text-3xl font-bold text-orange-600">
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold mb-3 text-gray-700">Order Items:</h4>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center bg-white rounded-lg p-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-700">
                                                        ₹{item.price * item.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status Update Buttons */}
                                    <div className="flex gap-3 flex-wrap">
                                        {order.orderStatus === 'new' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="flex-1 min-w-[200px] bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.orderStatus === 'preparing' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'served')}
                                                className="flex-1 min-w-[200px] bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                            >
                                                Mark as Served
                                            </button>
                                        )}
                                        {order.orderStatus === 'served' && (
                                            <div className="flex-1 min-w-[200px] bg-green-100 text-green-700 py-3 px-6 rounded-lg font-semibold text-center border-2 border-green-300">
                                                ✓ Order Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
