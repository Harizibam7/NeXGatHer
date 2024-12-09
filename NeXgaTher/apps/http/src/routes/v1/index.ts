import { Router } from "express";
import { userRouter } from "./user";

export const router = Router();

router.post("/signup", (req, res) => {

} );

router.post("/signin", (req, res) => {
    
} );

router.get("/avatars", (req, res) => {
    
} );

router.get("/elements", (req, res) => {
    
} );


router.use('/user', userRouter);
router.use('/space', spaceRouter);