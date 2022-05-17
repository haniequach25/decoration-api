import Product from "../models/SanPham.js";
import DonHang from "../models/DonHang.js";
import mongoose from "mongoose";
import { cleanAccents } from "../../services/format/index.js";

const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    // query.keywords = cleanAccents(query.keywords)
    query.keywords =
      query.keywords instanceof RegExp
        ? query.keywords
        : new RegExp(query.keywords, "i");
  }
  if (query.TenSanPham) {
    query.TenSanPham = new RegExp(query.TenSanPham, "i");
  }
  Product.count(query)
    .then((count) => {
      return Product.find(query, select, cursor)
        .sort({ createdAt: -1 })
        .populate({
          path: "DanhMucSP",
          options: {
            withDeleted: true,
          },
        })
        .populate({
          path: "AnhMoTa",
          field: "source",
          options: {
            withDeleted: true,
          },
        })
        .then((product) => ({
          result: {
            totalCount: count,
            totalPage: Math.ceil(count / cursor.limit),
            pageSize: cursor.limit,
            pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
            data: product,
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
const show = async ({ params }, res) => {
  let q;
  if (Number(params.id)) {
    q = { _id: params.id };
  } else {
    q = { slug: params.id };
  }
  Product.findOne(q)
    .populate({
      path: "DanhMucSP",
      options: {
        withDeleted: true,
      },
    })
    .populate({
      path: "AnhMoTa",
      field: "source",
      options: {
        withDeleted: true,
      },
    })
    .then((p) => p)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const create = (req, res) => {
  try {
    Product.create(req.body)
      .then(() => {
        return res.status(200).json({ message: "Add product success" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
const update = async (req, res) => {
  Product.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.status(201).json({ message: "Update success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
const remove = async (req, res) => {
  try {
    const order = await DonHang.findOne({
      items: { $elemMatch: { sanpham: req.params.id } },
    });
    if (order) {
      return res
        .status(500)
        .json({ message: `Product currently in order ${order._id}` });
    }
    Product.findOne({ _id: req.params.id })
      .then((product) => (product ? product.remove() : null))
      .then(() => res.status(201).json({ message: "Delete success" }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    console.log(err.message);
  }
};
const comment = async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        $push: {
          Comments: {
            commenter: req.body.commenter,
            content: req.body.content,
            email: req.body.email,
            date: req.body.date,
            rating: req.body.rating,
          },
        },
      }
    );
    const product = await Product.findOne({ _id: req.params.id });
    if (product.Comments && product.Comments.length > 0) {
      const averageRating = product.Comments.map((p) => p.rating).reduce(
        (a, b) => a + b,
        0
      );
      product.averageRating = averageRating / product.Comments.length;
      await product.save();
    }
    return res.status(201).json({ message: "Comment success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export { index, show, create, update, remove, comment };
