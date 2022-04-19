import { index, uploads, remove } from "../controllers/HinhAnhController.js";
import auth from "../auth.js";
import express from "express";
import { middleware as query } from "../querymen.js";
import multer from 'multer'
import randomToken from "random-token";
import passport from "../../services/passport/index.js";

const storage = multer.diskStorage({
  // destination: function (request,file,callback){
  //   callback(null, 'uploads');
  // },
  filename: function(request, file, callback){
    callback(null,Date.now()+ randomToken(10) + file.originalname.replace(/\s/g,""));
  }
})

const upload = multer({
  storage: storage
})
const router = express.Router();

router.get("/", query(), index);
router.post("/",upload.array('image'),uploads);
router.delete("/:id", passport.authenticate('jwt', { session: false }), remove);

export default router;
