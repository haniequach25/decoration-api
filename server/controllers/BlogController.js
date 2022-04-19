import Blog from "../models/Blog.js";
const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.keywords) {
    query.keywords =
      query.keywords instanceof RegExp
        ? query.keywords
        : new RegExp(query.keywords, "i");
  }
  Blog.count(query)
    .then((count) => {
      return Blog.find(query, select, cursor)
        .sort({ createdAt: -1 })
        .populate({
          path: "DanhMucBlog",
          options: { withDeleted: true },
        })
        .populate({
          path: "IDAnh",
          field: "source",
          options: { withDeleted: true },
        })
        .populate({
          path: "TaiKhoan",
          options: { withDeleted: true },
        })
        .then((blog) => ({
          result: {
            totalCount: count,
            totalPage: Math.ceil(count / cursor.limit),
            pageSize: cursor.limit,
            pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
            data: blog,
          },
        }));
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
};
const show = ({ params }, res, next) => {
  let q;
  if (Number(params.id)) {
    q = { _id: params.id };
  } else {
    q = { slug: params.id };
  }
  if (q)
    Blog.findOne(q)
      .populate({
        path: "DanhMucBlog",
        options: { withDeleted: true },
      })
      .populate({
        path: "IDAnh",
        field: "source",
        options: { withDeleted: true },
      })
      .populate({
        path: "TaiKhoan",
        options: { withDeleted: true },
      })
      .then((p) => p)
      .then((data) => {
        return res.status(200).json({ data });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  else return res.status(500).json({ message: "Id is not a number " });
};
const create = async (req, res) => {
  Blog.create(req.body)
    .then(() => {
      return res.status(200).json();
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
const update = async (req, res) => {
  Blog.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.status(201).json({ message: "Update success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
const remove = async (req, res) => {
  Blog.deleteById({ _id: req.params.id })
    .then(() => res.status(201).json({ message: "Delete success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
const comment = async (req, res) => {
  console.log(req.body);
  Blog.updateOne(
    { _id: req.params.id },
    {
      $push: {
        Comments: {
          commenter: req.body.commenter,
          content: req.body.content,
          email: req.body.email,
          date: req.body.date,
        },
      },
    }
  )
    .then(() => res.status(201).json({ message: "Comment success" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
export { index, show, create, update, remove, comment };
