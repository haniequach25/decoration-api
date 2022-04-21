import mongoose from 'mongoose'
import AutoInrement from 'mongoose-sequence'
import mongoose_delete from "mongoose-delete";
import mongooseKeywords from "mongoose-keywords";
import { cleanAccents } from '../../services/format/index.js';

const AutoIncrement = AutoInrement(mongoose)
const Schema = mongoose.Schema;

const danhMucBlogSchema = new Schema({
    _id: Number,
    TenDanhMucBlog:{
        type:String,
        required: true
    },
}, { timestamps : true })

danhMucBlogSchema.plugin(mongooseKeywords, {
    paths: ['_id', 'TenDanhMucBlog']
  })
danhMucBlogSchema.plugin(AutoIncrement,{id: 'categoryblog_id', inc_field: '_id'})
danhMucBlogSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: "all",
    withDeleted: true
});
const danhmucblog = mongoose.model("DanhMucBlog",danhMucBlogSchema);
export default danhmucblog;