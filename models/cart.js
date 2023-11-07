import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [
        {
            game: {
                type: Schema.Types.ObjectId,
                ref: 'Games',
                required: true,
            },
            quantity: { type: Number, required: true, min: [1, 'Quantity can not be less than 1.'], default: 1 },
            name: { type: String, required: true },  
            price: { type: Number, required: true }, 
        },
    ],
});

const Cart = mongoose.model('Cart', CartSchema, 'cart');

export default Cart;
