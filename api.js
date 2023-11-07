import dotenv from 'dotenv'
import express from 'express'
import authRoute from "./routes/auth.js"
import cartRoute from "./routes/cart.js"
import userRoute from "./routes/users.js"
import gamesRoute from "./routes/games.js"
import path from 'path';
import bankRoute from "./routes/stripe.js"
import Games from './models/games.js'
import orderRoute from "./routes/order.js"
import mongoose  from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import multer from 'multer'
import { fileURLToPath } from 'url';
const app = express();

dotenv.config()





const DB = "mongodb+srv://vaqsi24:juventus1990@shop.31bo5lw.mongodb.net/gamereact?w=majority";

const allowedOrigins = ['http://localhost:5173'];




app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

//midlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/v1/games", gamesRoute)
app.use('/bank', bankRoute)
app.use('/', orderRoute)
app.use("/api/v1/cart",cartRoute)
app.use((err,req,res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "wrong"
  return res.status(errorStatus).json(errorMessage)
} )

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});



app.post('/add-products', upload.array('photos', 5), async (req, res) => {
  try {
    console.log('User creating game:', req.user);

    const { name, price, creator, discount, description, rating, genre } = req.body;
    
  
    const photos = req.files.map(file => file.filename);

    console.log('Received data:', { name, price, genre, creator, discount, description, photos, rating });

    const newGames = await Games.create({
      name,
      price,
      photos,
      genre,
      creator,
      discount,
      description,
      rating,
    });

    const savedGames = await newGames.save();
    console.log('Saved Game:', savedGames);

    res.status(200).json(savedGames);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



app.use(express.static(path.join('public')));

app.use('/uploads', express.static('uploads'));
mongoose
  .connect(DB)
  .then(result => {
    app.listen(4500);
    console.log('working');
  })
  .catch(err => {
    console.log(err);
  });
