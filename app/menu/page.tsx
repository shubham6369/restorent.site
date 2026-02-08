'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MOCK_MENU } from '@/lib/mockData';
import { MenuItem } from '@/types';
import MenuCard from '@/components/MenuCard';
import StickyCartButton from '@/components/StickyCartButton';
import { Utensils, Coffee, Dessert, ChefHat } from 'lucide-react';

const categories = [
    { id: 'starters', name: 'Starters', icon: Utensils },
    { id: 'main-course', name: 'Main Course', icon: ChefHat },
    { id: 'drinks', name: 'Drinks', icon: Coffee },
    { id: 'desserts', name: 'Desserts', icon: Dessert },
];

export default function HomePage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [tableNumber, setTableNumber] = useState<string>('');

    useEffect(() => {
        // Check for table number in URL params
        const params = new URLSearchParams(window.location.search);
        const table = params.get('table');
        if (table) {
            setTableNumber(table);
            localStorage.setItem('tableNumber', table);
        } else {
            const savedTable = localStorage.getItem('tableNumber');
            if (savedTable) {
                setTableNumber(savedTable);
            }
        }

        // Fetch menu items
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            if (!db) {
                setMenuItems(MOCK_MENU);
                return;
            }
            const menuRef = collection(db, 'menuItems');
            const q = query(menuRef, orderBy('category'), orderBy('name'));
            const snapshot = await getDocs(q);

            const items: MenuItem[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as MenuItem[];

            setMenuItems(items);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setMenuItems(MOCK_MENU);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems =
        activeCategory === 'all'
            ? menuItems
            : menuItems.filter((item) => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-32">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        Welcome to TasteHub
                    </h1>
                    <p className="text-xl text-center mb-6">
                        Order delicious food directly from your table
                    </p>

                    {/* Table Number Display/Input */}
                    {tableNumber ? (
                        <div className="bg-white text-gray-800 rounded-full px-6 py-3 max-w-md mx-auto text-center shadow-lg">
                            <span className="font-semibold">Table Number: </span>
                            <span className="text-orange-600 font-bold text-xl">{tableNumber}</span>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Enter your table number"
                                value={tableNumber}
                                onChange={(e) => {
                                    setTableNumber(e.target.value);
                                    localStorage.setItem('tableNumber', e.target.value);
                                }}
                                className="w-full px-6 py-3 rounded-full text-gray-800 text-center font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="sticky top-16 z-30 bg-white shadow-md py-4 mb-8">
                <div className="container mx-auto px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${activeCategory === 'all'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Items
                        </button>
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${activeCategory === cat.id
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Menu Items Grid */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500">No items available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Cart Button */}
            <StickyCartButton />
        </div>
    );
}
