
import dotenv from 'dotenv';
import express from 'express';
import paypal from "@paypal/checkout-server-sdk"
import Cart from "../models/cart.js"
dotenv.config();

const router = express.Router();

const sandboxClientId = 'AaL2cK-MnqIwtBLSlnmPKX47Afh4kb6QXmSsFvWF5xLAdWBM2qB9Jud3rTVGgE8xxuHRJEyWGk7v2gR5';
const sandboxClientSecret = 'EJ5P5pQLX5NKnrjJMHiaRQHCIfbkGCxBLXEqv2fCxg54CrbgItAfjX1c1txcwrp-XgAXJiZ0Bk1eHaB1';
const environment = new paypal.core.SandboxEnvironment(sandboxClientId, sandboxClientSecret);
const client = new paypal.core.PayPalHttpClient(environment);



router.post('/pay', async (req, res, next) => {
  const userId = req.body.userId; // Assuming user ID is included in the request body
  const cartItems = req.body.items;

  // Calculate the total amount dynamically from cart items
  const totalAmount = calculateTotalAmount(cartItems);

  // Create an order request
  const createOrderRequest = new paypal.orders.OrdersCreateRequest();
  createOrderRequest.headers['prefer'] = 'return=representation';
  createOrderRequest.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: totalAmount.toFixed(2),
        },
        items: cartItems.map((item) => ({
          name: item.name,
          description: item.game,
          quantity: item.quantity,
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2),
          },
        })),
      },
    ],
  });

  try {
    // Execute the order request
    const createOrderResponse = await client.execute(createOrderRequest);

    // Extract the order ID
    const orderId = createOrderResponse.result.id;

    // Here you can store the order ID, user ID, and other relevant information in your database
    // For example, create a new record in your database to represent this payment

    res.json({ orderId, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


function calculateTotalAmount(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export default router;




