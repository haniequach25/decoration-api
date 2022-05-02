import mongoose from "mongoose";
// import mongooseSlug from "mongoose-slug-generator";
import mongooseKeywords from "mongoose-keywords";
import AutoInrement from "mongoose-sequence";
import mongoSlug from "mongoose-slug-plugin";
import dayjs from "dayjs";
import { cleanAccents } from "../../services/format/index.js";
const AutoIncrement = AutoInrement(mongoose);
const Schema = mongoose.Schema;
const sanphamSchema = new Schema(
  {
    codeCounter: Number,
    code: {
      type: String,
      maxlength: 20,
      unique: true,
    },
    TenSanPham: {
      type: String,
      required: true,
    },
    DonGia: {
      type: Number,
      required: true,
    },
    MoTa: {
      type: String,
    },
    SoLuong: {
      type: Number,
      min: 0,
      required: true,
    },
    SoLuongDaBan: {
      type: Number,
      min: 0,
      required: true,
    },
    // slug: {
    //   type: String,
    //   slug: "TenSanPham",
    //   unique: true,
    // },
    AnhMoTa: [
      {
        type: Number,
        ref: "HinhAnh",
      },
    ],
    Comments: [
      {
        commenter: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: 5,
        },
        email: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
          default: Date.now(),
        },
      },
    ],
    DanhMucSP: {
      type: Number,
      ref: "DanhMucSanPham",
    },
    averageRating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);
// sanphamSchema.methods = {
//   view(full) {
//     const view = {
//       _id: this._id,
//       TenSanPham: this.TenSanPham,
//       slug: this.slug,
//       DonGia: this.DonGia,
//       AnhMoTa: this.AnhMoTa,
//       SoLuong: this.SoLuong,
//       SoLuongDaBan: this.SoLuongDaBan,
//       DanhMucSP: this.DanhMucSP,
//       MoTa: this.MoTa,
//       NgayKhoiTao: this.createdAt,
//     };
//     return full
//       ? {
//           ...view,
//           MoTa: this.MoTa,
//         }
//       : view;
//   },
// };
// mongoose.plugin(mongooseSlug);
sanphamSchema.path("codeCounter").set(function (counter) {
  this.code = `PRODUCT-${new Date().getFullYear()}${counter
    .toString()
    .padStart(6, "0")}`;
  return counter;
});
sanphamSchema.plugin(AutoIncrement, { inc_field: "codeCounter" });

sanphamSchema.plugin(mongooseKeywords, {
  paths: ["code", "TenSanPham"],
});
sanphamSchema.plugin(mongoSlug, {
  tmpl: "<%=TenSanPham%>-<%=dayjs(new Date()).format('YYYY-MM-DD-HH-mm-ss')%>",
  locals: { dayjs },
});
// sanphamSchema.plugin(AutoIncrement, { id: "product_id", inc_field: "_id" });
// sanphamSchema.plugin(mongoose_delete, {
//   deletedAt: true,
//   overrideMethods: "all",
//   withDeleted: true
// });

const sanpham = mongoose.model("SanPham", sanphamSchema);
export default sanpham;
