import {
    comment
  } from "../controllers/BlogController.js";
  import passport from "../../services/passport/index.js";
  import express from "express";
  const router = express.Router();
  
  router.put('/:id', comment)
  export default router;
    