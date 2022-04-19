import mongoose from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import mongoose_delete from "mongoose-delete";

const Schema = mongoose.Schema;
import AutoInrement from 'mongoose-sequence'
const AutoIncrement = AutoInrement(mongoose)
const hinhanhSchema = new Schema({
    _id: Number,
    source:{
        type: String,
        required: true
    },
},{  timestamps: true})





hinhanhSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: "all",
    withDeleted: true
  });
hinhanhSchema.plugin(AutoIncrement,{id: 'image_id', inc_field: '_id'})
hinhanhSchema.plugin(mongooseKeywords, {
    paths: ['_id']
  })
const hinhanh = mongoose.model('HinhAnh', hinhanhSchema)

export default hinhanh