// Type Definitions for Multi-Vendor Restaurant Platform

export interface Store {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    image: string;
    banner?: string;
    category: string[];
    rating: number;
    reviewCount: number;
    address: string;
    phoneNumber: string;
    isOpen: boolean;
    deliveryTime: string; // e.g., "20-30 min"
    createdAt: Date;
    updatedAt: Date;
}

export interface MenuItem {
    id: string;
    storeId: string; // Linked to a specific store
    name: string;
    description: string;
    price: number;
    category: 'starters' | 'main-course' | 'drinks' | 'desserts' | string;
    image: string;
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
}

export interface Order {
    id: string;
    storeId: string; // Linked to a specific store
    customerId: string;
    items: {
        menuItemId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    tableNumber?: string; // Optional for delivery
    address?: string; // For delivery
    totalAmount: number;
    paymentMethod: 'upi' | 'card' | 'cash';
    paymentStatus: 'paid' | 'unpaid' | 'pending';
    orderStatus: 'new' | 'preparing' | 'served' | 'delivered' | 'cancelled';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Table {
    id: string;
    storeId: string;
    tableNumber: string;
    qrCode?: string;
    active: boolean;
}

export interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface OrderFormData {
    tableNumber: string;
    paymentMethod: 'upi' | 'card' | 'cash';
}

export type UserRole = 'customer' | 'store_owner' | 'admin';

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phoneNumber?: string;
    role: UserRole;
    storeId?: string; // Only for store_owner
    deliveryAddress?: {
        street: string;
        city: string;
        pincode: string;
        state: string;
    };
    wishlist: string[]; // array of menuItem ids
    loyaltyPoints?: number;
    createdAt: Date;
}

