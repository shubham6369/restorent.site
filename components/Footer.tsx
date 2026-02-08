import Link from 'next/link';
import { Utensils, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-full">
                                <Utensils className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                TasteHub
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Bringing the finest flavors to your table with a modern touch. Experience seamless dining with our QR-code ordering system.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">Home</Link></li>
                            <li><Link href="/menu" className="text-gray-400 hover:text-orange-500 transition-colors">Menu</Link></li>
                            <li><Link href="/reserve" className="text-gray-400 hover:text-orange-500 transition-colors">Reservations</Link></li>
                            <li><Link href="/track-order" className="text-gray-400 hover:text-orange-500 transition-colors">Track Order</Link></li>
                            <li><Link href="/profile" className="text-gray-400 hover:text-orange-500 transition-colors">My Profile</Link></li>
                            <li><Link href="/admin" className="text-gray-400 hover:text-orange-500 transition-colors">Admin Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-orange-500 mt-1" size={20} />
                                <span className="text-gray-400">123 Foodie Lane, Gourmet City, GC 56789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-orange-500" size={20} />
                                <span className="text-gray-400">+91 73660 32884</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-orange-500" size={20} />
                                <span className="text-gray-400">contact@tastehub.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Opening Hours</h4>
                        <ul className="space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-400">Mon - Fri</span>
                                <span className="text-orange-500">10:00 - 22:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">Saturday</span>
                                <span className="text-orange-500">09:00 - 23:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">Sunday</span>
                                <span className="text-orange-500">09:00 - 22:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} TasteHub Restaurant. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
