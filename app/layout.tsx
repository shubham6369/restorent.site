import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TasteHub - Restaurant Ordering System',
    description: 'Order delicious food directly from your table with our QR-code powered ordering system',
    keywords: 'restaurant, food ordering, QR code, dine-in ordering, menu',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        {children}
                        <WhatsAppButton />
                        <Footer />
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    borderRadius: '10px',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
