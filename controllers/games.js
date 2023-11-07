import Games from '../models/games.js'

import express from 'express'

const app = express();







export const createGame =   async (req, res, next) => {

};

  
  
  
export const updateGame = async (req, res, next) => {
    try {
        const updatedGames = await Games.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true})
       
        res.status(200).json(updatedGames)
    } catch (err) {
            res.status(500).json(err)
    }
}

export const deleteGame = async (req, res, next) => {
    try {
        await Games.findByIdAndDelete(req.params.id)
         
          res.status(200).json("deleted")
      } catch (err) {
              res.status(500).json(err)
      }
}

export const saleGames = async (req, res, next) => {
    try {
        const { discount } = req.body;
        const gameId = req.params.gameId;
    
      
        const game = await Games.findById(gameId);
    
        if (!game) {
          return res.status(404).json({ message: 'Game not found' });
        }
    
       
        game.price -= (game.price * discount) / 100;
    
      
        await game.save();
    
        res.status(200).json({ message: 'Sale applied successfully', game });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

export const singleGame = async (req, res, next) => {
    try {
        const games = await Games.findById(req.params.id)
       
        res.status(200).json(games)
    } catch (err) {
            res.status(500).json(err)
    }
}

export const filterByGanre = async (req, res, next) => {
    if (!req.query.ganre) {
        return res.status(400).json({ error: "Missing 'ganre' parameter" });
    }

    const genres = req.query.ganre.split(",");
    
    try {
        const filteredGames = await Games.find({ ganre: { $in: genres } });

        res.status(200).json(filteredGames);
    } catch (err) {
        next(err);
    }
};


export const allGame = async (req, res, next) => {
    try {
        const games = await Games.find()
        
        res.status(200).json(games)
        } catch (err) {
            next(err)
        }
}