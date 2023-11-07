import express from 'express'




import {  allGame, createGame, deleteGame, filterByGanre, saleGames, singleGame, updateGame } from '../controllers/games.js'
import { verifyAdmin } from '../utils/verifyToken.js'
const router = express.Router()


//create
// router.post("/",  createGame)

//update
router.put("/:id", verifyAdmin, updateGame)


router.get("/ganre", filterByGanre)



//delete

router.delete("/:id",  deleteGame)

//get
router.get("/:id", singleGame)

//getall
router.get("/", allGame)

//add items
// router.post('/add', addItems)

export default router
