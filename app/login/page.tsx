'use client';

import { useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogIn, Mail, Lock, User, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Welcome back!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success('Account created successfully!');
            }
            router.push('/');
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
            toast.success('Logged in with Google');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 py-20">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500">
                            {isLogin
                                ? 'Login to access your orders and wishlist'
                                : 'Join TasteHub to start ordering'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.44-1.2 1.2-2.88 1.96-5.72 1.96-4.68 0-8.52-3.8-8.52-8.6s3.84-8.6 8.52-8.6c2.56 0 4.48 1 5.84 2.32l2.32-2.32C18.44 1.36 15.76 0 12.48 0 5.48 0 0 5.48 0 12.48S5.48 24.96 12.48 24.96c3.4 0 6.28-1.12 8.4-3.32 2.12-2.2 2.88-5.28 2.88-7.72 0-.6-.04-1.16-.12-1.72H12.48z" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-orange-600 font-semibold hover:underline"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
