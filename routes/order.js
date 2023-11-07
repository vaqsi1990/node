import dotenv from 'dotenv';
import express from 'express';
import paypal from '@paypal/checkout-server-sdk';

dotenv.config();

const router = express.Router();

const sandboxClientId = 'AaL2cK-MnqIwtBLSlnmPKX47Afh4kb6QXmSsFvWF5xLAdWBM2qB9Jud3rTVGgE8xxuHRJEyWGk7v2gR5';
const sandboxClientSecret = 'EJ5P5pQLX5NKnrjJMHiaRQHCIfbkGCxBLXEqv2fCxg54CrbgItAfjX1c1txcwrp-XgAXJiZ0Bk1eHaB1';
const environment = new paypal.core.SandboxEnvironment(sandboxClientId, sandboxClientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

router.get('/get-payment/:orderId', async (req, res, next) => {
  const orderId = req.params.orderId;

  // Fetch payment details for the specified order
  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await client.execute(request);

    res.json(response.result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
