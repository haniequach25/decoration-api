import Setting from '../models/Setting.js'
'use strict'
const index = ({ querymen: { query, select, cursor } }, res, next) => {
    Setting.find({})
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err})
    });
}
const show = ({ params }, res, next) => {

    Setting.findOne({ _id: params.id })
      .then((p) => (p))
      .then((data) => {
        return res.status(200).json({data});
      })
      .catch((err) => res.status(500).json({ message: err.message }));
}
const create = (req, res) => {
  Setting.create(req.body)
    .then(() => {
      return res.status(200).json({ msg: 'Add category product success'});
    })
    .catch((err) => {
      console.log(err)
      return  res.status(500).json({ message: err.message});
    });
}

const update = ( req, res) => {
  Setting.findOneAndUpdate({  _id: req.params.id }, req.body)
    .then(() => res.status(201).json({ message: "Update success" }))
    .catch((err) => res.status(500).json({ message: err}));
}

const updateMany = (req, res) => {
    Setting.bulkWrite(req.body.map(u => ({ updateOne: { filter: { _id: u._id }, update: { value: u.value } } })))
      .then(() => res.status(201).json({ message: "Update success" }))
      .catch((err) =>  res.status(500).json({ message: err.message}));
  }

const remove = (req, res) => {
  Setting.findOneAndDelete({  _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) => res.status(500).json({ message: err.message}));
}

export { index, create, update,updateMany, remove, show }