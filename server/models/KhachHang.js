import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import AutoInrement from "mongoose-sequence";
import mongoose_delete from "mongoose-delete";
import mongooseKeywords from "mongoose-keywords";
import { cleanAccents } from "../../services/format/index.js";

const AutoIncrement = AutoInrement(mongoose);
const Schema = mongoose.Schema;
const khachhangSchema = new Schema({
  _id: Number,
  TenKhachHang: {
    type: String,
    required: true,
  },
  DiaChi: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  SDT: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  NgaySinh: {
    type: Date,
    // required: true,
  },
  TrangThai: {
    type: Boolean,
    required: true
  },
}, { timestamps: true, _id: false });
khachhangSchema.pre("save",async function (next){
  try{
    const khachHang = this;
  if(khachHang.isModified("password"))
  {
    khachHang.password = await bcrypt.hash(khachHang.password,10)
  }
  next()
  }catch(err){
    console.log(err)
  }
})
khachhangSchema.plugin(mongooseKeywords, {
  paths: ["_id", "email", "SDT", "TenKhachHang"]
});
khachhangSchema.plugin(AutoIncrement, { id: "customer_id", inc_field: "_id" });
khachhangSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  withDeleted: true
});
const khachang = mongoose.model("KhachHang", khachhangSchema);
export default khachang;