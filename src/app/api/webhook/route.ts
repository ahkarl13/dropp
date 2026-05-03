import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { linkId, sellerUsername } = session.metadata || {}
    const customerEmail = session.customer_details?.email

    // Log the sale — in a real app you'd email the download link here
    console.log(`Sale: ${linkId} by ${sellerUsername} to ${customerEmail}`)
  }

  return NextResponse.json({ received: true })
}
