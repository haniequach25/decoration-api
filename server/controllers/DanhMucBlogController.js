// lấy dữ liệu từ csdl
import DanhMucBlog from '../models/DanhMucBlog.js'


// lấy tất cả dữ liệu để phân trang
const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    query.keywords = (query.keywords instanceof RegExp) ? query.keywords : new RegExp((query.keywords), 'i')
  }
    DanhMucBlog.count(query)
    .then((count) => {
      return DanhMucBlog.find(query, select, cursor).sort({ createdAt: -1 }).then((dmblog) => ({
        result: {
          totalCount: count,
          // tổng số bản ghi
          totalPage: Math.ceil(count / cursor.limit),
          // tổng số trang
          pageSize: cursor.limit,
          // có bnh phần tử trong 1 trang 
          pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
          // đang ở trang nào
          data: dmblog,
          // dữ liệu trả về
        },
      }))
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return  res.status(500).json({ message: err})
    });
}
const show = ({ prams }, res, next) => {
    let q;
    if (Number(params.id)) {
      q = {  _id: params.id };
    }
    if(q)
    DanhMucBlog.findOne(q)
      .then((p) => p)
      .then((data) => {
        return res.status(200).json({data});
      })
      .catch((err) =>  res.status(500).json({ message: err.message}));
  else return res.status(500).json({ message: 'Id is not a number '})
}
const create = (req, res) => {
  // tạo 1 dm blog
    DanhMucBlog.create(req.body)
    .then(() => {
      return res.status(200).json();
    })
    .catch((err) => {
      return  res.status(500).json({ message: err.message});
    });
}

const update = (req, res, next) => {
    DanhMucBlog.findOneAndUpdate({  _id: req.params.id }, req.body)
    .then(() => res.status(201).json({ message: "Update success" }))
    .catch((err) =>  res.status(500).json({ message: err.message}));
}

const remove = (req, res, next) => {
    DanhMucBlog.deleteById({  _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) =>  res.status(500).json({ message: err.message}));
}

export { index, create, update, remove , show}