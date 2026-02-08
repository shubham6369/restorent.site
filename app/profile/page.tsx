'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    User,
    ShoppingBag,
    Heart,
    Settings,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    ChevronRight,
    Headset
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, MenuItem } from '@/types';
import toast from 'react-hot-toast';

type Tab = 'orders' | 'profile' | 'wishlist' | 'support';

export default function ProfilePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlistItems, setWishlistItems] = useState<MenuItem[]>([]);
    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setFetchingData(true);
        try {
            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef,
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Order[];
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setFetchingData(false);
        }
    }, [user]);

    const fetchWishlist = useCallback(async () => {
        if (!profile?.wishlist || profile.wishlist.length === 0) {
            setWishlistItems([]);
            return;
        }
        setFetchingData(true);
        try {
            const menuRef = collection(db, 'menuItems');
            const snapshot = await getDocs(menuRef);
            const allItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MenuItem[];

            const filtered = allItems.filter(item => profile.wishlist.includes(item.id));
            setWishlistItems(filtered);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setFetchingData(false);
        }
    }, [profile]);

    useEffect(() => {
        if (user && activeTab === 'orders') {
            fetchOrders();
        } else if (user && activeTab === 'wishlist') {
            fetchWishlist();
        }
    }, [user, activeTab, fetchOrders, fetchWishlist]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
            </div>
        );
    }

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'profile', label: 'Profile Info', icon: User },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'support', label: 'Support', icon: Headset },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Cover */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 pt-20 pb-12 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <User size={48} className="text-orange-500" />
                        </div>
                        <div className="text-center md:text-left text-white flex-1">
                            <h1 className="text-3xl font-bold">{profile?.displayName || user.displayName || 'Guest User'}</h1>
                            <p className="opacity-90">{user.email}</p>
                        </div>

                        {/* Loyalty Card */}
                        <div className="flex gap-4 md:gap-8 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{profile?.loyaltyPoints || 450}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-orange-200">Points</div>
                            </div>
                            <div className="w-px bg-white/20"></div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{orders.length}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-orange-200">Orders</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto gap-8 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 border-b-2 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-8">
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Your Recent Orders</h2>
                        {fetchingData ? (
                            <div className="py-10 text-center text-gray-500">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-xl text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold"
                                >
                                    Explore Menu
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
                                                <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                            </div>
                                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.orderStatus === 'served' ? 'bg-green-100 text-green-600' :
                                                order.orderStatus === 'preparing' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-600 mb-2">Items:</p>
                                            <div className="flex flex-wrap gap-2 text-sm font-medium">
                                                {order.items.map((item, i) => (
                                                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-lg">
                                                        {item.quantity}x {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 font-medium">Display Name</p>
                                        <p className="text-gray-800 font-bold">{profile?.displayName || 'Not provided'}</p>
                                    </div>
                                    <ChevronRight className="text-gray-300" />
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <Mail size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                        <p className="text-gray-800 font-bold">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                        <Phone size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                        <p className="text-gray-800 font-bold">{profile?.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <ChevronRight className="text-gray-300" />
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 font-medium">Default Delivery Address</p>
                                        {profile?.deliveryAddress ? (
                                            <p className="text-gray-800 font-bold">
                                                {profile.deliveryAddress.street}, {profile.deliveryAddress.city}, {profile.deliveryAddress.pincode}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">Add address for quicker delivery</p>
                                        )}
                                    </div>
                                    <ChevronRight className="text-gray-300" />
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-4 text-orange-600 font-bold border-2 border-orange-100 rounded-2xl hover:bg-orange-50 transition-all">
                                <Settings size={20} />
                                Account Settings
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'wishlist' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
                        {fetchingData ? (
                            <div className="py-10 text-center text-gray-500">Loading wishlist...</div>
                        ) : wishlistItems.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-xl text-gray-500 mb-6">Your wishlist is empty.</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold"
                                >
                                    Browse Menu
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {wishlistItems.map(item => (
                                    <div key={item.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group">
                                        <div className="relative h-48">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500">
                                                <Heart size={20} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                            <p className="text-orange-600 font-black text-2xl mb-4">₹{item.price}</p>
                                            <button
                                                onClick={() => router.push('/')}
                                                className="w-full bg-gray-800 text-white py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all"
                                            >
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'support' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Quick Support</h2>
                        <div className="grid gap-4">
                            <a
                                href="https://wa.me/917366032884"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-green-100 hover:shadow-md transition-all group"
                            >
                                <div className="p-4 bg-green-500 text-white rounded-2xl group-hover:scale-110 transition-transform">
                                    <Headset size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">Chat with Us</h3>
                                    <p className="text-gray-500">Get instant help on WhatsApp</p>
                                </div>
                                <ExternalLink className="text-gray-300" />
                            </a>

                            <a
                                href="tel:+917366032884"
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-orange-100 hover:shadow-md transition-all group"
                            >
                                <div className="p-4 bg-orange-500 text-white rounded-2xl group-hover:scale-110 transition-transform">
                                    <Phone size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">Call Support</h3>
                                    <p className="text-gray-500">Available 10 AM - 10 PM</p>
                                </div>
                                <ExternalLink className="text-gray-300" />
                            </a>

                            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                                <h3 className="text-lg font-bold text-orange-900 mb-2">Frequently Asked Questions</h3>
                                <p className="text-orange-700 text-sm mb-4">Check our common queries regarding delivery, payment, and orders.</p>
                                <button className="text-orange-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    View FAQ <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
