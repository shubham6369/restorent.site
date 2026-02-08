'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ReservationPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '2',
        name: '',
        email: '',
        phone: '',
        specialRequest: ''
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, send to Firebase
        toast.success("Reservation request sent!");
        setStep(3);
    };

    if (step === 3) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Table Reserved!</h2>
                    <p className="text-gray-600 mb-10">We've sent a confirmation email to {formData.email}. We look forward to serving you!</p>
                    <Link href="/" className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden">
                    {/* Visual Side */}
                    <div className="relative hidden lg:block">
                        <img
                            src="https://images.unsplash.com/photo-1550966841-3eeea2c1f83c?w=800&fit=crop"
                            alt="Restaurant Ambience"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/20 to-transparent p-12 flex flex-col justify-end text-white">
                            <h2 className="text-4xl font-bold mb-4">A Table for Every Memory</h2>
                            <p className="text-orange-200">Whether it's a romantic dinner or a family celebration, we have the perfect spot for you.</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-2 text-orange-600 font-bold mb-8">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
                            <div className={`h-1 w-8 rounded ${step >= 2 ? 'bg-orange-500' : 'bg-gray-100'}`}></div>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">Reserve a Table</h1>
                        <p className="text-gray-500 mb-8">Secure your dining experience at TasteHub.</p>

                        {step === 1 ? (
                            <form onSubmit={handleNext} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Select Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Time Slot</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                        <select
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all appearance-none"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        >
                                            <option value="">Select Time</option>
                                            <option value="18:00">06:00 PM</option>
                                            <option value="19:00">07:00 PM</option>
                                            <option value="20:00">08:00 PM</option>
                                            <option value="21:00">09:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Number of Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all"
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                                >
                                    Continue <ChevronRight size={20} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all h-24 resize-none"
                                        placeholder="e.g. Birthday celebration, window seat..."
                                        value={formData.specialRequest}
                                        onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 border-2 border-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-2/3 bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                                    >
                                        Confirm Reservation
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
