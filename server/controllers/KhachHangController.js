import KhachHang from "../models/KhachHang.js";
import jwt from "jsonwebtoken";
import { cleanAccents } from "../../services/format/index.js";
const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    query.keywords = query.keywords.toString().replace(/[^\w\s]/g, ' ')
    // query.keywords = cleanAccents(query.keywords)
    query.keywords = (query.keywords instanceof RegExp) ? query.keywords : new RegExp((query.keywords), 'i')
  }
  KhachHang.count(query)
    .then((count) => {
      return KhachHang.find(query, select, cursor).sort({ createdAt: -1 }).then((khachhang) => ({
        result: {
          totalCount: count,
          totalPage: Math.ceil(count / cursor.limit),
          pageSize: cursor.limit,
          pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
          data: khachhang,
        },
      }));
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const userInfo = (req, res) => {
  try {
    console.log(req.user)
    if (req.user.customer.TrangThai == true) {
      return res.status(200).json(req.user.customer);
    } else {
      return res.status(401).json({ message: "User blocked" });
    }
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const checkEmail = await KhachHang.find({ email: req.body.email }).catch(
      (err) => res.status(400).json({ message: err.message })
    );
    if (checkEmail && checkEmail.length) {
      return res.status(409).json({
        message: "Email existed",
      });
    } else {
      const khachHang = await KhachHang.create(req.body).catch((err) => {
        console.log(err);
        return res.status(400).json({ message: err.message });
      });
      return res.status(200).json({
        khachHang,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
const login = async (req, res) => {
  try {
    const user = req.user;
    if (user.customer.TrangThai == true) {
      const token = jwt.sign(user, process.env.JWT_KEY);
      return res.status(200).json({ ...user, token });
    } else {
      return res.status(500).json({ message: "Tài khoản bị khóa " });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: "Có lỗi không cấp quyền đăng nhập được" });
  }
};
const show = async ({ params }, res) => {
  let q;
  if (Number(params.id)) {
    q = { _id: params.id };
  }
  KhachHang.findOne(q)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const update = async (req, res) => {
  try {
    KhachHang.findById({ _id: req.params.id })
      .then((data) => (data ? Object.assign(data, req.body).save() : null))
      .then((data) => {
        const token = jwt.sign({customer: data}, process.env.JWT_KEY);
        console.log(data)
        return res.status(201).json({ message: "Update success",token: token })
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    console.log(err);
  }
};
const remove = async (req, res) => {
  KhachHang.deleteById({ _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export { index, register, login, userInfo, update, remove, show };
