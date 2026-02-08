'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Utensils, Clock, MapPin, Star, ArrowRight, ChevronRight, ShoppingBag, Heart, Phone, Mail } from 'lucide-react';

export default function LandingPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 z-10">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-block px-4 py-1 rounded-full bg-orange-500/20 text-orange-500 font-semibold text-sm mb-6 border border-orange-500/30">
                            Now Serving in Gourmet City
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Dining Experience</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                            Experience the fusion of traditional flavors and modern culinary arts. Orders delivered to your table in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/menu"
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                Explore Menu <ArrowRight size={20} />
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all"
                            >
                                Join TasteHub
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute bottom-12 left-12 hidden lg:flex gap-12 border-t border-white/10 pt-8 animate-fade-in">
                    <div>
                        <div className="text-3xl font-bold">4.9/5</div>
                        <div className="text-gray-400">Customer Rating</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">15min</div>
                        <div className="text-gray-400">Avg Service Time</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-gray-400">Signature Dishes</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TasteHub?</h2>
                        <p className="text-gray-600">We redefine what it means to dine by combining technology with taste.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Clock className="text-orange-500" size={32} />,
                                title: "Swift Service",
                                desc: "Proprietary kitchen management system ensures your food is served at peak freshness."
                            },
                            {
                                icon: <Utensils className="text-orange-500" size={32} />,
                                title: "Premium Quality",
                                desc: "Ingredients sourced daily from organic farms to maintain the highest standards of taste."
                            },
                            {
                                icon: <MapPin className="text-orange-500" size={32} />,
                                title: "Digital Dining",
                                desc: "Scan, Order, & Pay from your table. No more waiting for servers to take orders."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                                <div className="mb-6 p-4 bg-orange-50 rounded-2xl w-fit group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Items Preview (Conceptual) */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-bold mb-4">Chef's Recommendations</h2>
                            <p className="text-gray-600">Hand-picked dishes that define the TasteHub experience.</p>
                        </div>
                        <Link href="/menu" className="group flex items-center gap-2 text-orange-600 font-bold text-lg">
                            View All Items <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Placeholder items since we can't easily fetch data in a static-ish way without duplication */}
                        {[
                            { name: "Truffle Mushroom Risotto", price: "450", rating: "4.9", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=400&fit=crop" },
                            { name: "Spiced Atlantic Salmon", price: "680", rating: "5.0", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop" },
                            { name: "Wild Berry Cheesecake", price: "320", rating: "4.8", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop" },
                            { name: "Craft Burger Special", price: "380", rating: "4.7", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop" }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative h-64 mb-6 overflow-hidden rounded-3xl shadow-lg">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500 fill-current" />
                                        <span className="text-sm font-bold">{item.rating}</span>
                                    </div>
                                    <button className="absolute bottom-4 right-4 p-3 bg-white text-gray-900 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors">
                                        <ShoppingBag size={20} />
                                    </button>
                                </div>
                                <h4 className="text-xl font-bold mb-2">{item.name}</h4>
                                <div className="text-orange-600 font-bold text-lg">₹{item.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="py-24 bg-orange-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Special Offers & Events</h2>
                        <p className="text-gray-600 font-medium">Don't miss out on our limited-time culinary experiences.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative overflow-hidden rounded-[2rem] group h-[400px]">
                            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&fit=crop" alt="Weekend Brunch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                                <span className="bg-orange-500 text-white px-4 py-1 rounded-full w-fit mb-4 text-sm font-bold uppercase tracking-wider">Every Weekend</span>
                                <h3 className="text-3xl font-bold text-white mb-2">Champagne Brunch</h3>
                                <p className="text-gray-300 mb-6">Enjoy unlimited mimosas and chef's special breakfast platters from 10 AM to 2 PM.</p>
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold w-fit hover:bg-orange-500 hover:text-white transition-colors">Book a Table</button>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-[2rem] group h-[400px]">
                            <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&fit=crop" alt="Corporate Events" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                                <span className="bg-red-500 text-white px-4 py-1 rounded-full w-fit mb-4 text-sm font-bold uppercase tracking-wider">Group Booking</span>
                                <h3 className="text-3xl font-bold text-white mb-2">Corporate Dinners</h3>
                                <p className="text-gray-300 mb-6">Host your company milestones with us. Custom menu options and private dining pods available.</p>
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold w-fit hover:bg-red-500 hover:text-white transition-colors">Inquire Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Savor the Ambience</h2>
                    <p className="text-gray-600">A glimpse into our kitchen, plates, and cozy atmosphere.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 overflow-hidden">
                    <div className="space-y-4">
                        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 1" />
                        <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 2" />
                    </div>
                    <div className="space-y-4">
                        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 3" />
                        <img src="https://images.unsplash.com/photo-1550966841-3eeea2c1f83c?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 4" />
                    </div>
                    <div className="space-y-4">
                        <img src="https://images.unsplash.com/photo-1502301103675-0b05c249026e?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 5" />
                        <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 6" />
                    </div>
                    <div className="space-y-4">
                        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 7" />
                        <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop" className="rounded-3xl hover:opacity-90 transition-opacity" alt="Gallery 8" />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Voices of TasteHub</h2>
                        <p className="text-gray-400">Join over 10,000 satisfied diners.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Johnson", text: "The QR ordering system is a game changer. No more waiting to grab someone's attention just to order an extra drink!" },
                            { name: "Michael Chen", text: "Best pizza in the city, hands down. The crust is exactly how they serve it in Naples." },
                            { name: "Priya Sharma", text: "Love the wishlist feature. I can plan my next visit while I'm eating my current meal!" }
                        ].map((t, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                                <div className="flex text-yellow-500 mb-6 font-bold">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-lg italic text-gray-300 mb-6">"{t.text}"</p>
                                <div className="font-bold">— {t.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
            </section>

            {/* Contact & Map Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Visit Us</h2>
                            <p className="text-gray-600 text-lg mb-12">We are located in the heart of the city, easily accessible with ample parking space. Come join us for an unforgettable meal.</p>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                                        <MapPin size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Address</h4>
                                        <p className="text-gray-600">123 Foodie Lane, Gourmet City, GC 56789</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                                        <Phone size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Phone</h4>
                                        <p className="text-gray-600">+91 73660 32884</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                                        <Mail size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Email</h4>
                                        <p className="text-gray-600">contact@tastehub.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <a href="https://wa.me/917366032884" target="_blank" className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">
                                    Chat on WhatsApp
                                </a>
                                <Link href="/reserve" className="flex items-center gap-2 border-2 border-orange-500 text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all">
                                    Reserve Table
                                </Link>
                            </div>
                        </div>

                        <div className="h-[500px] w-full bg-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            {/* Placeholder for GMap integration - in actual app, use @react-google-maps/api */}
                            <iframe
                                title="Restaurant Location"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Start Your Culinary Journey?</h2>
                            <p className="text-xl text-white/90 mb-10">Sign up today and get 15% off your first order at TasteHub.</p>
                            <Link
                                href="/login"
                                className="inline-block bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
                            >
                                Get Started Now
                            </Link>
                        </div>
                        {/* Decorative blobs for depth */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
