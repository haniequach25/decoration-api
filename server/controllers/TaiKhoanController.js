import TaiKhoan from "../models/TaiKhoan.js";
import jwt from "jsonwebtoken";
import { cleanAccents } from "../../services/format/index.js";

const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    query.keywords = query.keywords.toString().replace(/[^\w\s]/gi, ' ').replace(/%40/g, '@')
    // query.keywords = cleanAccents(query.keywords)
    query.keywords = (query.keywords instanceof RegExp) ? query.keywords : new RegExp((query.keywords), 'i')
  }
  TaiKhoan.count(query)
    .then((count) => {
      return TaiKhoan.find(query, select, cursor).sort({ createdAt: -1 })
        .populate("Avatar",'source')
        .then((taikhoan) => ({
          result: {
            totalCount: count,
            totalPage: Math.ceil(count / cursor.limit),
            pageSize: cursor.limit,
            pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
            data: taikhoan,
          },
        }));
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message})
    });
};
const register = async (req, res) => {
  try {
    console.log("Hello")
    const checkEmail = await TaiKhoan.find({ email: req.body.email });
    console.log(req.body)
    if (checkEmail && checkEmail.length) {
      return res.status(409).json({
        message: "Email existed",
      });
    } else {
      const taiKhoan = await TaiKhoan.create(req.body).catch(err => res.status(500).json({ message: err}));
      return res.status(200).json({
        taiKhoan
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "Có lỗi không đăng ký được" });
  }
};
const login = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign(user, process.env.JWT_KEY);
    return res.status(200).json({ ...user, token });
    
  } catch (err) {
    return res.status(401).json({ message: "Có lỗi không cấp quyền đăng nhập được" });
  }
};
// get me 
const userInfo = (req, res) => {
  try{
    return res.status(200).json(req.user)
  }catch(err){
    return res.status(401).json({ message: err.message });
  }
};
const show = async ({ params }, res) => {
  let q;
  if (Number(params.id)) {
    q = { _id: params.id };
  }
  TaiKhoan.findOne(q)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const update = async (req, res) => {
  try{
    console.log('Hello')
    TaiKhoan.findById({ _id: req.params.id })
    .then((data) => (data ? Object.assign(data, req.body).save().then(t => t.populate("Avatar")) : null))
    .then(data => {
        const token = jwt.sign({user: data}, process.env.JWT_KEY);
        return res.status(201).json({ message: "Update success",token: token })
    })
      .catch((err) => res.status(500).json({ message: err.message }));
  }catch(err){
    console.log('Fail')
    console.log(err.message)
  }
};
const remove = async ( req, res) => {
  TaiKhoan.deleteById({ _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) =>  res.status(500).json({ message: err.message}));
};
export { index, register, login, userInfo,show, update, remove};
