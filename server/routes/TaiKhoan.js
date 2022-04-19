import express from 'express'
import { register,login,index, userInfo, update, show,remove } from '../controllers/TaiKhoanController.js'
import passport from "../../services/passport/index.js";
import { middleware as query } from "../querymen.js";

const router = express.Router();
router.get('/',query(),index)
router.post('/register',register)
router.post('/login',passport.authenticate('local', { session: false }),login)
router.get('/me',passport.authenticate('jwt', { session: false }), userInfo)
router.get('/:id',show)
router.put('/:id',passport.authenticate('jwt', { session: false }),update)
router.delete('/:id',passport.authenticate('jwt', { session: false }),remove)
export default router