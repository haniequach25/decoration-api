import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AutoInrement from "mongoose-sequence";
import mongooseKeywords from "mongoose-keywords";
import mongoose_delete from "mongoose-delete";
import { cleanAccents } from "../../services/format/index.js";

const AutoIncrement = AutoInrement(mongoose);
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: Number,
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    TenTacGia: {
      type: String,
      index: true,
      trim: true,
    },
    SDT: {
      type: String,
      trim: true,
    },
    Avatar: {
      type: Number,
      ref: "HinhAnh",
    },
    DiaChi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);
// userSchema.method.generateToken = async () => {
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
//   user.token = token;
//   await user.save();
//   return token;
// }
userSchema.pre("save", async function(next) {
  const user = this;
  console.log(user)
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
userSchema.plugin(AutoIncrement, { id: "user_id", inc_field: "_id" });
userSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  withDeleted: true
});
userSchema.plugin(mongooseKeywords, {
  paths: ["_id", "email", "SDT"]
});
// userSchema.statics.checkLogin = async (email,pass) => {
//   const user = await TaiKhoan.find({ email })
//   if(!user)
//   {
//     throw new Error({ error: 'Email invalid'})
//   }
//   const isPasswordMatch = await bcrypt.compare(pass,user.password)
//   if(!isPasswordMatch)
//   {
//     throw new Error({ error: 'Password invalid'})
//   }
//   return user
// }
const taikhoan = mongoose.model("TaiKhoan", userSchema);

export default taikhoan;
