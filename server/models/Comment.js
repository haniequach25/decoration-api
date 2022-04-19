import mongoose from 'mongoose'
import AutoInrement from 'mongoose-sequence'
import mongoose_delete from "mongoose-delete";
import mongooseKeywords from "mongoose-keywords";
import { cleanAccents } from '../../services/format/index.js';

const AutoIncrement = AutoInrement(mongoose)
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id: Number,
    commenter: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
}, { timestamps : true })

commentSchema.plugin(AutoIncrement,{id: 'categoryblog_id', inc_field: '_id'})
commentSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: "all",
    withDeleted: true
});
const comment = mongoose.model("comment",commentSchema);
export default comment;