// app/api/checkout/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RTsB4LG2LIRH4tiXCjzuHyl', // tvoje Stripe cena
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?email=${email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
