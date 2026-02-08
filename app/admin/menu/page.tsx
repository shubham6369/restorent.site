'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
} from 'firebase/firestore';
import { MenuItem } from '@/types';
import { ArrowLeft, Edit2, Trash2, Plus, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuManagementPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'starters' as MenuItem['category'],
        image: '',
        available: true,
    });

    useEffect(() => {
        if (!auth) {
            // Demo mode
            setUser({ email: 'admin@demo.com', displayName: 'Demo Admin' });
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                router.push('/admin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        if (!db) {
            // Demo mode: load mock menu
            import('@/lib/mockData').then((mod) => {
                setMenuItems(mod.MOCK_MENU);
            });
            return;
        }

        const menuRef = collection(db, 'menuItems');
        const q = query(menuRef, orderBy('category'), orderBy('name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: MenuItem[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as MenuItem[];
            setMenuItems(items);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!db) {
            const newItem: MenuItem = {
                id: 'demo-' + Math.random().toString(36).substr(2, 9),
                ...formData,
                price: parseFloat(formData.price),
                createdAt: new Date(),
                updatedAt: new Date(),
            } as MenuItem;
            setMenuItems(prev => [...prev, newItem]);
            toast.success('Demo Mode: Item added (local only)');
            setShowAddForm(false);
            return;
        }

        try {
            await addDoc(collection(db, 'menuItems'), {
                ...formData,
                price: parseFloat(formData.price),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            toast.success('Menu item added successfully');
            setShowAddForm(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'starters',
                image: '',
                available: true,
            });
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to add menu item');
        }
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        if (!db) {
            setMenuItems(prev => prev.map(item => item.id === editingItem.id ? {
                ...item,
                ...formData,
                price: parseFloat(formData.price),
                updatedAt: new Date(),
            } as MenuItem : item));
            toast.success('Demo Mode: Item updated (local only)');
            setEditingItem(null);
            return;
        }

        try {
            const itemRef = doc(db, 'menuItems', editingItem.id);
            await updateDoc(itemRef, {
                ...formData,
                price: parseFloat(formData.price),
                updatedAt: new Date(),
            });

            toast.success('Menu item updated successfully');
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'starters',
                image: '',
                available: true,
            });
        } catch (error) {
            console.error('Error updating item:', error);
            toast.error('Failed to update menu item');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return;

        if (!db) {
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
            toast.success('Demo Mode: Item deleted (local only)');
            return;
        }

        try {
            await deleteDoc(doc(db, 'menuItems', itemId));
            toast.success('Menu item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete menu item');
        }
    };

    const toggleAvailability = async (item: MenuItem) => {
        if (!db) {
            setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
            toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
            return;
        }
        try {
            const itemRef = doc(db, 'menuItems', item.id);
            await updateDoc(itemRef, {
                available: !item.available,
                updatedAt: new Date(),
            });
            toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
        } catch (error) {
            console.error('Error toggling availability:', error);
            toast.error('Failed to update availability');
        }
    };

    const startEdit = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            image: item.image,
            available: item.available,
        });
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setShowAddForm(false);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'starters',
            image: '',
            available: true,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Menu Management
                            </h1>
                        </div>

                        <button
                            onClick={() => {
                                setShowAddForm(true);
                                setEditingItem(null);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                        >
                            <Plus size={20} />
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Add/Edit Form */}
                {(showAddForm || editingItem) && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                            </h2>
                            <button
                                onClick={cancelEdit}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                        required
                                    >
                                        <option value="starters">Starters</option>
                                        <option value="main-course">Main Course</option>
                                        <option value="drinks">Drinks</option>
                                        <option value="desserts">Desserts</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="available" className="font-semibold">
                                    Available for ordering
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    <Save size={20} />
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Menu Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all ${!item.available ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-4xl">🍽️</div>
                                )}
                                {!item.available && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-bold">Not Available</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                    <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                                </div>

                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                                <div className="mb-3">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">
                                        {item.category.replace('-', ' ')}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-semibold transition-colors ${item.available
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {item.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                        {item.available ? 'Available' : 'Unavailable'}
                                    </button>

                                    <button
                                        onClick={() => startEdit(item)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
