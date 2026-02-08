'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StickyCartButton() {
    const { getTotalItems, getTotalPrice } = useCart();
    const router = useRouter();
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    if (totalItems === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-transparent">
            <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-between font-bold text-lg"
            >
                <div className="flex items-center gap-2">
                    <ShoppingCart size={24} />
                    <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>View Cart</span>
                    <span className="bg-white text-orange-600 px-4 py-1 rounded-full">
                        ₹{totalPrice}
                    </span>
                </div>
            </button>
        </div>
    );
}
