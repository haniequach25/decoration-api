import mongoose from "mongoose";
import mongooseSlug from "mongoose-slug-generator";
import mongoose_delete from "mongoose-delete";
import mongooseKeywords from "mongoose-keywords";
import AutoInrement from "mongoose-sequence";
const AutoIncrement = AutoInrement(mongoose);
const Schema = mongoose.Schema;
const blogSchema = new Schema(
  {
    _id: Number,
    TaiKhoan: {
      type: Number,
      ref: "TaiKhoan",
      required: true,
    },
    DanhMucBlog: {
      type: Number,
      ref: "DanhMucBlog",
      required: true,
    },
    TieuDe: {
      type: String,
      required: true,
    },
    IDAnh: {
      type: Number,
      ref: "HinhAnh",
      required: true,
    },
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
        email: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true
        }
      },
    ],
    TomTat: {
      type: String,
      required: true,
    },
    NoiDung: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: "TieuDe",
      unique: true,
    },
  },
  { timestamps: true }
);
mongoose.plugin(mongooseSlug);
blogSchema.plugin(mongooseKeywords, {
  paths: ["_id", "TieuDe"],
});
blogSchema.plugin(AutoIncrement, { id: "blog_id", inc_field: "_id" });
blogSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  withDeleted: true
});
const blog = mongoose.model("Blog", blogSchema);
export default blog;
