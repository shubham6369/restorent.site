'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/917366032884"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <div className="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Need Help? Chat with us!
            </div>
            <MessageCircle size={32} />
        </a>
    );
}
