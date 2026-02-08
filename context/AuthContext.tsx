'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
    toggleWishlist: (itemId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!auth) {
            // Demo mode: set a guest profile
            setProfile({
                uid: 'demo-user',
                email: 'guest@example.com',
                displayName: 'Guest User',
                wishlist: [],
                createdAt: new Date(),
            });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Check if admin
                setIsAdmin(user.email === 'admin@restaurant.com');

                // Get or create user profile in Firestore
                try {
                    const profileRef = doc(db, 'users', user.uid);
                    const profileSnap = await getDoc(profileRef);

                    if (profileSnap.exists()) {
                        setProfile(profileSnap.data() as UserProfile);
                    } else {
                        if (user.email !== 'admin@restaurant.com') {
                            const newProfile: UserProfile = {
                                uid: user.uid,
                                email: user.email || '',
                                displayName: user.displayName || '',
                                wishlist: [],
                                createdAt: new Date(),
                            };
                            await setDoc(profileRef, newProfile);
                            setProfile(newProfile);
                        }
                    }
                } catch (err) {
                    console.error("Profile fetch error:", err);
                }
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        if (auth) await firebaseSignOut(auth);
        else setProfile(null);
    };

    const toggleWishlist = async (itemId: string) => {
        if (!profile) {
            toast.error('Please login to use wishlist');
            return;
        }

        const newWishlist = profile.wishlist.includes(itemId)
            ? profile.wishlist.filter(id => id !== itemId)
            : [...profile.wishlist, itemId];

        if (!db) {
            // Local update for demo
            setProfile({ ...profile, wishlist: newWishlist });
            toast.success(profile.wishlist.includes(itemId) ? 'Removed from wishlist' : 'Added to wishlist');
            return;
        }

        try {
            const profileRef = doc(db, 'users', profile.uid);
            await setDoc(profileRef, { wishlist: newWishlist }, { merge: true });
            setProfile({ ...profile, wishlist: newWishlist });
            toast.success(profile.wishlist.includes(itemId) ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.error('Failed to update wishlist');
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, isAdmin, logout, toggleWishlist }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
