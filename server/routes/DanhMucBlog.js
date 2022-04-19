import {
    index,
    show,
    create,
    update,
    remove,
  } from "../controllers/DanhMucBlogController.js";
  import passport from "../../services/passport/index.js";
  import express from "express";
  import { middleware as query } from "../querymen.js";
  const router = express.Router();
  
  router.get('/',query(),index)
  router.get('/:id',show)
  router.post('/', create)
  router.put('/:id',passport.authenticate('jwt', { session: false }),update)
  router.delete('/:id',passport.authenticate('jwt', { session: false }),remove)
  
  export default router;
  