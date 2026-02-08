'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('restaurant_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('restaurant_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: MenuItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.menuItem.id === item.id
            );

            if (existingItem) {
                toast.success(`Added another ${item.name} to cart`);
                return prevCart.map((cartItem) =>
                    cartItem.menuItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            toast.success(`${item.name} added to cart`);
            return [...prevCart, { menuItem: item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => {
            const item = prevCart.find((cartItem) => cartItem.menuItem.id === itemId);
            if (item) {
                toast.success(`${item.menuItem.name} removed from cart`);
            }
            return prevCart.filter((cartItem) => cartItem.menuItem.id !== itemId);
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.menuItem.id === itemId ? { ...cartItem, quantity } : cartItem
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('restaurant_cart');
        toast.success('Cart cleared');
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce(
            (total, item) => total + item.menuItem.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
