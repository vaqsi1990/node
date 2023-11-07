import express from 'express'
import { addItem, cartItems, delete_item} from "../controllers/cart.js"

const router = express.Router()
router.get('/cart/:userId', cartItems);
router.post('/:userId', addItem);
router.delete('/:userId/:itemId', delete_item);
export default router
