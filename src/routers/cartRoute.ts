import express from 'express'
import { addToCart, getCartItems } from '../controllers/cartController';

const router = express.Router()

router.post("/", addToCart);
router.get("/:id", getCartItems);




export default router;