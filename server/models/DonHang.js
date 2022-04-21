import mongoose from "mongoose";
import AutoInrement from "mongoose-sequence";
import mongooseKeywords from "mongoose-keywords";
import { cleanAccents } from "../../services/format/index.js";

const AutoIncrement = AutoInrement(mongoose);
const Schema = mongoose.Schema;

const donhangSchema = new Schema(
  {
    _id: Number,
    items: [
      {
        sanpham: {
          type: Schema.Types.ObjectId,
          ref: "SanPham",
          required: true,
        },
        soluong: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    MaKhachHang: {
      type: Number,
      ref: "KhachHang",
      required: true,
    },
    MaTaiKhoan: {
      type: Number,
      ref: "TaiKhoan",
    },
    TongTien: {
      type: Number,
      min: 0,
      default: 0,
    },
    GhiChu: {
      type: String,
    },
    DiaChi: {
      type: String,
      required: true,
    },
    SDT: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    TrangThai: {
      type: Number,
      // hoan thanh hay chua hoan thanh
      // 0 tao
      // 1 hoan thanh
      enum: [0, 1],
      required: true,
    },
    KieuThanhToan: {
      type: String,
      enum: ["cod", "momo"],
      required: true,
      default: "cod",
    },
    TinhTrangThanhToan: {
      type: Number,
      // hoan thanh hay chua hoan thanh
      enum: [0, 1],
      required: true,
    },
    NgayHoanThanh: {
      type: Date,
    },
  },
  { timestamps: true }
);
donhangSchema.plugin(AutoIncrement, { id: "order_id", inc_field: "_id" });
donhangSchema.pre("save", async function () {
  this.wasNew = this.isNew;
});

donhangSchema.path("items").set(function (items) {
  if (items && items.length) {
    this.TongTien = items
      .map((item) => {
        return item.sanpham.DonGia * item.soluong;
      })
      .reduce((a, b) => a + b, 0);
  }
  this._oldItems = this.items;
  return items;
});
donhangSchema.path("TrangThai").set(function (TrangThai) {
  this.oldStatus = this.TrangThai;
  return TrangThai;
});
donhangSchema.post("save", async function (doc) {
  if (this.wasNew) {
    for (const item of doc.items) {
      if (item.sanpham.SoLuong >= item.soluong) {
        item.sanpham.SoLuong = item.sanpham.SoLuong - item.soluong;
        item.sanpham.SoLuongDaBan = item.sanpham.SoLuongDaBan + item.soluong;
      }
    }
    doc.items.map((i) => i.sanpham.save());
  } else {
    await doc.populate("items.sanpham");

    const oldProducts = await this.model("SanPham").find({
      _id: { $in: this._oldItems.map((i) => i.sanpham) },
    });
    this._oldItems = this._oldItems.map((i) => ({
      ...i,
      sanpham: oldProducts.find(
        (p) => p._id.toString() === i.sanpham.toString()
      ),
    }));
    const changeItems = [];
    for (var i = 0; i < this._oldItems.length; i++) {
      for (var j = 0; j < doc.items.length; j++) {
        // console.log(this._oldItems[i]._doc.soluong,doc.items[j].soluong,'-------------------')
        if (
          this._oldItems[i].sanpham._id.toString() ==
            doc.items[j].sanpham._id.toString() &&
          this._oldItems[i]._doc.soluong != doc.items[j].soluong
        ) {
          if (
            doc.items[j].soluong - this._oldItems[i]._doc.soluong >
            this._oldItems[i].sanpham.SoLuong
          )
            throw new Error("Số lượng quá số lượng cho phép");
          else {
            this._oldItems[i].sanpham.SoLuong =
              this._oldItems[i].sanpham.SoLuong +
              this._oldItems[i]._doc.soluong -
              doc.items[j].soluong;
            this._oldItems[i].sanpham.SoLuongDaBan =
              this._oldItems[i].sanpham.SoLuongDaBan -
              this._oldItems[i]._doc.soluong +
              doc.items[j].soluong;
            changeItems.push(this._oldItems[i].sanpham);
          }
        }
      }
    }
    // console.log(changeItems)
    await changeItems.map((i) => i.save());
    const removedItems = [];
    for (const item of this._oldItems) {
      if (
        doc.items.findIndex(
          (i) => i.sanpham._id.toString() === item.sanpham._id.toString()
        ) === -1
      ) {
        removedItems.push(item);
      }
    }
    const addedItems = [];
    for (const item of doc.items) {
      if (
        this._oldItems.findIndex(
          (i) => i.sanpham._id.toString() === item.sanpham._id.toString()
        ) === -1
      ) {
        addedItems.push(item);
      }
    }
    // console.log(removedItems,'remove')
    // console.log(addedItems,'add')
    for (var i = 0; i < removedItems.length; i++) {
      removedItems[i].sanpham.SoLuong =
        removedItems[i].sanpham.SoLuong + removedItems[i]._doc.soluong;
      removedItems[i].sanpham.SoLuongDaBan =
        removedItems[i].sanpham.SoLuongDaBan - removedItems[i]._doc.soluong;
    }
    for (var i = 0; i < addedItems.length; i++) {
      addedItems[i].sanpham.SoLuong =
        addedItems[i].sanpham.SoLuong - addedItems[i]._doc.soluong;
      addedItems[i].sanpham.SoLuongDaBan =
        addedItems[i].sanpham.SoLuongDaBan + addedItems[i]._doc.soluong;
    }

    await removedItems.map((i) => i.sanpham.save());
    await addedItems.map((i) => i.sanpham.save());
  }
});
donhangSchema.post("remove", async function (doc) {
  await doc.populate('items.sanpham')
  const restore = []
  if (this.TrangThai == 0) {
    console.log("Hello")
    for (const item of doc.items) {
      if (item.sanpham.SoLuong > item.soluong) {
        item.sanpham.SoLuong = item.sanpham.SoLuong + item.soluong;
        item.sanpham.SoLuongDaBan = item.sanpham.SoLuongDaBan - item.soluong;
        
      }
    }
    restore.push(...doc.items.map((i) => i.sanpham.save()))
    await Promise.all(restore)
  }
});
donhangSchema.plugin(mongooseKeywords, {
  paths: ['_id', 'SDT', 'email']
});
const donhang = mongoose.model("DonHang", donhangSchema);

export default donhang;
