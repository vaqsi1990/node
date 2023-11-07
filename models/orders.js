import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        orderItems: [
          {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            games: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: 'Games',
            },
          },
        ],


},
{
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema);

export default Order;