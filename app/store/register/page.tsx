'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Store, UserProfile } from '@/types';
import toast from 'react-hot-toast';
import { Store as StoreIcon, MapPin, Phone, Utensils, ArrowRight } from 'lucide-react';

export default function StoreRegistrationPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        address: '',
        phoneNumber: '',
        deliveryTime: '20-30 min',
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <StoreIcon className="mx-auto text-orange-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold mb-4">Register Your Store</h1>
                    <p className="text-gray-600 mb-6">You need to be logged in to register a store.</p>
                    <button
                        onClick={() => router.push('/login?redirect=/store/register')}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        Login to Continue
                    </button>
                </div>
            </div>
        );
    }

    if (profile?.role === 'store_owner' || profile?.role === 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold mb-4">Already Registered</h1>
                    <p className="text-gray-600 mb-6">You already have a store registered or you are an admin.</p>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) {
            toast.error('Database not connected. (Demo Mode)');
            return;
        }

        setSubmitting(true);
        try {
            // 1. Create the store
            const storeData: Partial<Store> = {
                ownerId: user.uid,
                name: formData.name,
                description: formData.description,
                category: formData.category.split(',').map(c => c.trim()),
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                deliveryTime: formData.deliveryTime,
                isOpen: true,
                rating: 5.0,
                reviewCount: 0,
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', // Default image
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const storeRef = await addDoc(collection(db, 'stores'), {
                ...storeData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 2. Update user profile
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                role: 'store_owner',
                storeId: storeRef.id,
            });

            toast.success('Store registered successfully!');
            router.push('/admin/dashboard');
        } catch (error) {
            console.error('Error registering store:', error);
            toast.error('Failed to register store. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-4">
                        <StoreIcon className="text-orange-600" size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Grow your business with TasteHub
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Join thousands of restaurants and reach more customers today.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Store Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Utensils className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            placeholder="e.g. Delicious Pizza Point"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                        placeholder="Tell customers what makes your store special..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categories (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            placeholder="Pizza, Italian, Fast Food"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Store Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            placeholder="Full address of your restaurant"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Average Delivery Time
                                    </label>
                                    <select
                                        value={formData.deliveryTime}
                                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                                    >
                                        <option>15-25 min</option>
                                        <option>20-30 min</option>
                                        <option>30-45 min</option>
                                        <option>45-60 min</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                {submitting ? 'Registering...' : (
                                    <>
                                        Register My Store
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 text-orange-500 font-bold">1</div>
                        <h3 className="font-bold text-gray-900">Sign Up</h3>
                        <p className="text-sm text-gray-500">Create your account and tell us about your store.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 text-orange-500 font-bold">2</div>
                        <h3 className="font-bold text-gray-900">Add Menu</h3>
                        <p className="text-sm text-gray-500">List your delicious dishes with photos and prices.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 text-orange-500 font-bold">3</div>
                        <h3 className="font-bold text-gray-900">Start Selling</h3>
                        <p className="text-sm text-gray-500">Receive orders and grow your happy customer base.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icons that were missing
function CheckCircle({ className, size }: { className?: string; size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
