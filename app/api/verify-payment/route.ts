import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await request.json();

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_secret) {
            console.error('Razorpay secret missing');
            return NextResponse.json(
                { error: 'Razorpay is not configured' },
                { status: 503 }
            );
        }

        // Create signature for verification
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        const isVerified = expectedSignature === razorpay_signature;

        if (isVerified) {
            return NextResponse.json({
                verified: true,
                message: 'Payment verified successfully',
            });
        } else {
            return NextResponse.json(
                { verified: false, message: 'Payment verification failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
