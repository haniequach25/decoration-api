import {
    index,
    userInfo,
    register,
    update,
    remove,
    show,
    login
  } from "../controllers/KhachHangController.js";
  import passport from "../../services/passport/passportCustomer.js";
  import express from "express";
  import { middleware as query } from "../querymen.js";
  const router = express.Router();
  
  router.get('/',query(),index)

  router.post('/', register)
  router.post('/login',passport.authenticate('local', { session: false }), login)
  router.put('/:id',passport.authenticate('jwt', { session: false }),update)
  router.get('/me',passport.authenticate('jwt', { session: false }), userInfo)
  router.get('/:id', show)
  router.delete('/:id',passport.authenticate('jwt', { session: false }),remove)
  
  export default router;
  
