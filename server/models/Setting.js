import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const settingSchema = new Schema({
    _id: String,
    type:{
        type: String,
        required: true
    },
    value: Schema.Types.Mixed,
    name: {
        type: String,
        required: true
    }
},{ _id: false, timestamps: true})

const setting = mongoose.model('Setting', settingSchema)

export default setting