'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogIn, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        if (!auth) {
            // Demo mode
            toast.success('Demo Login successful!');
            router.push('/admin/dashboard');
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login successful!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error('Invalid email or password');
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many failed attempts. Please try again later.');
            } else {
                toast.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white rounded-full p-4 mb-4 shadow-2xl">
                        <Lock className="text-orange-600" size={48} />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-white/90">TasteHub Restaurant Management</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                    placeholder="admin@restaurant.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Login to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            <strong>Note:</strong> Only authorized admin users can access the dashboard.
                        </p>
                    </div>
                </div>

                {/* Back to Menu */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="text-white hover:text-white/80 font-semibold transition-colors"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
