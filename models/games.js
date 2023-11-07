import mongoose  from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const gameSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
      },
      photos: {
        type: [String],
        
      },
      reviews: [reviewSchema],
      creator: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      genre:{
        type: String,
        required: true
      },
      price:{
        type:Number,
        required: true
      },
      favourite: {
        type: Boolean,
        default: false,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
      rating: {
        type:Number,
        min:0,
        max:5
      }
})

const Games = mongoose.model('Games', gameSchema)

export default  Games