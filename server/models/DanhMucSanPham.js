import mongoose from "mongoose";
import AutoInrement from 'mongoose-sequence'
import mongoose_delete from "mongoose-delete";
import mongooseKeywords from "mongoose-keywords";
import { cleanAccents } from "../../services/format/index.js";

const AutoIncrement = AutoInrement(mongoose)
const Schema = mongoose.Schema;

const danhMucSanPhamSchema = new Schema(
  {
      _id: Number,
    TenDanhMucSP: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);
danhMucSanPhamSchema.plugin(mongooseKeywords, {
  paths: ['_id', 'TenDanhMucSP']
})
danhMucSanPhamSchema.plugin(AutoIncrement,{id: 'categoryproduct_id', inc_field: '_id'})
danhMucSanPhamSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  withDeleted: true
});
const danhmucsp = mongoose.model("DanhMucSanPham", danhMucSanPhamSchema);
export default danhmucsp;
