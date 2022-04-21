import { cleanAccents } from '../../services/format/index.js'
import DanhMucSanPham from '../models/DanhMucSanPham.js'
'use strict'
const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    query.keywords = (query.keywords instanceof RegExp) ? query.keywords : new RegExp((query.keywords), 'i')
  }
    DanhMucSanPham.count(query)
    .then((count) => {
      return DanhMucSanPham.find(query, select, cursor).sort({ createdAt: -1 }).then((dmsanpham) => ({
        result: {
          totalCount: count,
          totalPage: Math.ceil(count / cursor.limit),
          pageSize: cursor.limit,
          pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
          data: dmsanpham,
        },
      }))
    })  
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return  res.status(500).json({ message: err.message})
    });
}
const show = ({ params }, res, next) => {
    let q;
    if (Number(params.id)) {
      q = { _id: params.id };
    }
    if(q)
    DanhMucSanPham.findOne(q)
      .then((p) => (p))
      .then((data) => {
        return res.status(200).json({data});
      })
      .catch((err) =>  res.status(500).json({ message: err.message}));
  else return res.status(500).json({ message: 'Id is not a number '})
}
const create = (req, res) => {
  DanhMucSanPham.create(req.body)
    .then(() => {
      return res.status(200).json({ msg: 'Add category product success'});
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ message: err.message})
    });
}

const update = ( req, res) => {
  
  DanhMucSanPham.findOneAndUpdate({  _id: req.params.id }, req.body)
    .then(() => res.status(201).json({ message: "Update success" }))
    .catch((err) =>  res.status(500).json({ message: err.message}));
}

const remove = (req, res) => {
  DanhMucSanPham.deleteById({  _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) =>  res.status(500).json({ message: err.message}));
}

export { index, create, update, remove, show }