import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
