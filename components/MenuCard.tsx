'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types';
import { Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const { cart, addToCart, updateQuantity } = useCart();
    const { profile, toggleWishlist } = useAuth();

    const isInWishlist = profile?.wishlist.includes(item.id);
    const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrement = () => {
        if (quantity === 0) {
            addToCart(item);
        } else {
            updateQuantity(item.id, quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            updateQuantity(item.id, quantity - 1);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-orange-100 to-amber-50">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-4xl">🍽️</span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isInWishlist
                        ? 'bg-red-500 text-white shadow-lg scale-110'
                        : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
                        }`}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                </button>

                {!item.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Not Available</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                </p>

                {/* Price and Controls */}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                        ₹{item.price}
                    </span>

                    {item.available && (
                        <div className="flex items-center gap-2">
                            {quantity > 0 ? (
                                <div className="flex items-center gap-3 bg-orange-500 rounded-full px-2 py-1">
                                    <button
                                        onClick={handleDecrement}
                                        className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-white font-bold min-w-[20px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleIncrement}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md"
                                >
                                    Add
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
