import User from '../models/User.js'; 
import Cart from '../models/cart.js'; 
import Games from '../models/games.js'; 



export const cartItems = async (req, res) => {
    const userId = req.params.userId;
     try {
        let cart = await Cart.findOne({ user: userId }); 
        if (cart && cart.items.length > 0) {
            res.send(cart);
        } else {
            res.send(null);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


export const addItem = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { gameId, quantity, name, price } = req.body;


        if (!userId || !gameId) {
            return res.status(400).json({ error: 'Invalid userId or gameId' });
        }

        const user = await User.findById(userId);
        const game = await Games.findById(gameId);

        if (!user || !game) {
            return res.status(404).json({ error: 'User or game not found' });
        }

        if (!user || !game) {
            return res.status(404).json({ error: 'User or game not found' });
        }

        // Check if the user already has a cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart for the user if they don't have one
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
            // Associate the cart with the user
            user.cart = cart._id;
            await user.save();
        }

        // Now, add the item to the cart
        const cartItemIndex = cart.items.findIndex(item => item.game.toString() === gameId);
        if (cartItemIndex !== -1) {
            // If the game is already in the cart, increase the quantity
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            // If the game is not in the cart, add it with the name and price
            cart.items.push({ game: gameId, quantity, name, price });
        }
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};










export const delete_item = async (req,res) => {
    try {
       const userId = String(req.params.userId);
       const itemId = req.params.itemId
   
       let cart = await Cart.findOne({ user: userId })
   
       const itemInd= cart.items.findIndex(item => item._id.toString() === itemId)
   
       cart.items.splice(itemInd, 1)
   
       
       if(cart.items.length === 0 ) {
           await Cart.findByIdAndRemove(cart._id)
           await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });
        } else {
            await cart.save()

        }

       res.status(200).json({ message: "წაიშალა ბოზო"})
    } catch (error) {
       console.log(error);
       res.status(500).json({ error: error.message });
    }
   }