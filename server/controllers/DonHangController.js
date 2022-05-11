import DonHang from "../models/DonHang.js";
import SanPham from "../models/SanPham.js";
import pug from "pug";
import { sendGmail } from "../../services/nodemailer/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    // query.keywords = cleanAccents(query.keywords)
    query.keywords =
      query.keywords instanceof RegExp
        ? query.keywords
        : new RegExp(query.keywords, "i");
  }
  DonHang.count(query)
    .then((count) => {
      return DonHang.find(query, select, cursor)
        .sort({ createdAt: -1 })
        .populate({
          path: "items.sanpham",
          fields: "DonGia",
          populate: {
            path: "AnhMoTa",
            fields: "source",
            options: { withDeleted: true },
          },
          options: { withDeleted: true },
        })
        .populate({
          path: "MaKhachHang",
          options: { withDeleted: true },
        })
        .populate({
          path: "MaTaiKhoan",
          options: { withDeleted: true },
        })
        .then((donhang) => ({
          result: {
            totalCount: count,
            totalPage: Math.ceil(count / cursor.limit),
            pageSize: cursor.limit,
            pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
            data: donhang,
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
const filter = ({ querymen: { query, select, cursor } }, res, next) => {
  DonHang.count(query)
    .then((count) => {
      return DonHang.find(query)
        .populate({
          path: "items.sanpham",
          fields: "DonGia",
          populate: {
            path: "AnhMoTa",
            fields: "source",
            options: { withDeleted: true },
          },
          // options: { withDeleted: true },
        })
        .populate({
          path: "MaKhachHang",
          options: { withDeleted: true },
        })
        .populate({
          path: "MaTaiKhoan",
          options: { withDeleted: true },
        })
        .then((donhang) => ({
          data: donhang,
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
  DonHang.findOne(q)
    .populate("items.sanpham")
    .then((p) => p)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const create = async (req, res) => {
  try {
    if (req.body.items && req.body.items.length) {
      console.log(req.body.items.map((i) => i.sanpham._id));
      const products = await SanPham.find({
        _id: { $in: req.body.items.map((i) => i.sanpham._id) },
      });
      if (products && products.length) {
        let notice = "";
        let count = 0;
        for (const [index, item] of req.body.items.entries()) {
          const p = products.find(
            (i) => i._id.toString() === item.sanpham._id.toString()
          );
          if (!p) {
            count = count + 1;
            notice =
              notice +
              `Không tìm thấy sản phẩm có id bằng ${item.sanpham.code}\n`;
          } else if (p.SoLuong < 1) {
            count = count + 1;
            notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
          } else if (p.SoLuong < item.soluong) {
            count = count + 1;
            notice =
              notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
          } else {
            req.body.items[index].sanpham = p;
          }
        }
        if (count > 0) {
          return res.status(500).json({ message: notice });
        }
      } else {
        return res
          .status(500)
          .json({ message: "Không tìm thấy sản phẩm nào phù hợp" });
      }
    }
    DonHang.create({ ...req.body })
      .then((donhang) =>
        donhang.populate([
          {
            path: "items.sanpham",
            fields: "AnhMoTa TenSanPham",
            populate: {
              path: "AnhMoTa",
              fields: "source",
              options: { withDeleted: true },
            },
          },
        ])
      )
      .then(async (data) => {
        const adminTitle = "New order from HAUT corner";
        await sendGmail({
          to: data.email || "senpaione33@gmail.com",
          subject: `New order from HAUT corner [${data._id}]`,
          message: pug.renderFile(`${__dirname}/template.pug`, {
            title: adminTitle,
            order: data,
          }),
        });
        return data;
      })
      .then((data) => {
        return res.status(200).json({ data });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const update = async (req, res) => {
  try {
    let order = await DonHang.findById(req.params.id);
    console.log(req.body);
    if (order) {
      if (req.body.items && req.body.items.length) {
        const products = await SanPham.find({
          id: { $in: req.body.items.map((i) => i.sanpham._id) },
        });
        if (products && products.length) {
          for (const [index, item] of req.body.items.entries()) {
            const p = products.find((i) => {
              return i._id.toString() === item.sanpham._id.toString();
            });
            if (!p) {
              return res.status(500).json({
                message: `Không tìm thấy sản phẩm id = ${item.sanpham}`,
              });
            } else if (
              p.SoLuong < 1 &&
              !order.items
                .map((i) => i.sanpham._id.toString())
                .includes(p._id.toString())
            ) {
              return res
                .status(500)
                .json({ message: `Sản phẩm id = ${p.code} đã hết hàng` });
            } else if (
              p.SoLuong < item.soluong - item.soluongcu &&
              order.items
                .map((i) => i.sanpham._id.toString())
                .includes(p._id.toString())
            ) {
              return res
                .status(500)
                .json({ message: `Sản phẩm id = ${p.code} không đủ số lượng` });
            } else {
              req.body.items[index].sanpham = p;
            }
          }
        } else {
          return res
            .status(500)
            .json({ message: "Không tìm thấy sản phẩm nào phù hợp" });
        }
      }
    }
    order = await Object.assign(order, req.body).save();
    return res.status(200).json(order);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};
const remove = async (req, res) => {
  DonHang.findById({ _id: req.params.id })
    .then((data) => (data ? data.remove() : null))
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export { index, create, update, remove, show, filter };
