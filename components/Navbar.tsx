'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Utensils, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { getTotalItems } = useCart();
    const { user, profile, isAdmin, logout } = useAuth();
    const totalItems = getTotalItems();

    return (
        <nav className="sticky top-0 z-40 bg-orange-50/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-full group-hover:scale-110 transition-transform">
                            <Utensils className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            TasteHub
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link
                            href="/menu"
                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors hidden sm:block"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/reserve"
                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors hidden lg:block"
                        >
                            Reserve
                        </Link>
                        <Link
                            href="/track-order"
                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors hidden lg:block"
                        >
                            Track Order
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 md:gap-6">
                                {(profile?.role === 'store_owner' || profile?.role === 'admin') ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                                        >
                                            <UserIcon size={20} />
                                            <span className="hidden md:inline">Profile</span>
                                        </Link>
                                        <Link
                                            href="/store/register"
                                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors hidden xl:block"
                                        >
                                            Partner with us
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/store/register"
                                    className="text-gray-700 hover:text-orange-600 font-semibold transition-colors hidden sm:block"
                                >
                                    Partner with us
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all"
                                >
                                    Login
                                </Link>
                            </div>
                        )}


                        {/* Cart Icon */}
                        <Link
                            href="/checkout"
                            className="relative p-2 hover:bg-orange-50 rounded-full transition-colors"
                        >
                            <ShoppingCart className="text-gray-700" size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
