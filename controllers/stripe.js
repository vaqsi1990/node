
import Cart from '../models/cart.js';
import stripePackage from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripePackage(stripeKey);

const checkouts = async (req, res, next) => {
    try {
      // 1) Get the cart and the specific game
      const cart = await Cart.findById(req.params.cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const gameIdToSearch = req.params.gameId;
      const gameInCart = cart.items.find(item => item.game.toString() === gameIdToSearch);
  
      if (!gameInCart) {
        return res.status(404).json({ error: 'Game not found in the cart' });
      }
  
      // 2) Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/my-games?alert=purchase`,
        client_reference_id: req.params.gameId,
        line_items: [
          {
            name: `${gameInCart.name} Game`, // Assuming the game object has a 'name' property
            description: gameInCart.description,
            images: [
              // Add image URLs if available
            ],
            amount: gameInCart.price * 100,  // Assuming the price is in dollars
            currency: 'usd',
            quantity: 1
          }
        ]
      });
  
      // 3) Create session as a response
      res.status(200).json({
        status: 'success',
        session
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Webhook endpoint for handling Stripe events
const webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Check if the event is a checkout session completion
  if (event.type === 'checkout.session.completed') {
    // You can optionally perform actions here after a successful purchase
    // For example, update the user's account to grant access to the purchased game
    // Update the database accordingly based on your business logic
    console.log('Payment successful. Handle post-purchase logic here.');
  }

  res.status(200).json({ received: true });
};

export default checkouts