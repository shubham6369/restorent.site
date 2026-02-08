// Type Definitions for Restaurant Website

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'starters' | 'main-course' | 'drinks' | 'desserts';
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
    items: {
        menuItemId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    tableNumber: string;
    totalAmount: number;
    paymentMethod: 'upi' | 'card' | 'cash';
    paymentStatus: 'paid' | 'unpaid' | 'pending';
    orderStatus: 'new' | 'preparing' | 'served';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Table {
    id: string;
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

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phoneNumber?: string;
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
