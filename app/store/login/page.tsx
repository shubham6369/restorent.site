'use client';

import { useState } from 'react';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogIn, Mail, Lock, Store as StoreIcon, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function StoreLoginPage() {
    const router = useRouter();
    const { profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back, Store Partner!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success('Logged in successfully');
            router.push('/admin/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-orange-500 rounded-3xl mb-6 shadow-2xl shadow-orange-500/20">
                        <StoreIcon className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Store Partner Portal
                    </h1>
                    <p className="text-gray-400">
                        Manage your restaurant, orders, and menu efficiently
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Business Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500 text-gray-500">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-white placeholder:text-gray-600"
                                        placeholder="partner@restaurant.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500 text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-white placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? 'Authenticating...' : 'Login as Store'}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-sm px-4 bg-transparent backdrop-blur-3xl text-gray-500 font-bold uppercase tracking-widest">
                                    Or
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-white shadow-xl"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.44-1.2 1.2-2.88 1.96-5.72 1.96-4.68 0-8.52-3.8-8.52-8.6s3.84-8.6 8.52-8.6c2.56 0 4.48 1 5.84 2.32l2.32-2.32C18.44 1.36 15.76 0 12.48 0 5.48 0 0 5.48 0 12.48S5.48 24.96 12.48 24.96c3.4 0 6.28-1.12 8.4-3.32 2.12-2.2 2.88-5.28 2.88-7.72 0-.6-.04-1.16-.12-1.72H12.48z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-orange-500/5 border-t border-white/10 text-center">
                        <Link href="/store/register" className="text-orange-500 font-black hover:text-orange-400 transition-colors">
                            Don&apos;t have a store? Register Now
                        </Link>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-500 font-bold text-sm">
                    <ShieldCheck size={16} />
                    Secured by TasteHub Enterprise
                </div>
            </div>
        </div>
    );
}
