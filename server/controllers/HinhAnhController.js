import HinhAnh from "../models/HinhAnh.js";
import cloudinary from "../../services/cloudinary/index.js";
const index = ({ querymen: { query, select, cursor } }, res) => {
  HinhAnh.count(query)
    .then((count) =>
      HinhAnh.find(query, select, cursor).sort({ createdAt: -1 })
        .sort({ createdAt: -1 })
        .then((hinhanh) => ({
          result: {
            totalCount: count,
            totalPage: Math.ceil(count / cursor.limit),
            data: hinhanh,
          },
        }))
    )
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
const uploads = async (req, res) => {
  try {
    const url = [];

    for (const file of req.files) {
      console.log(file);
      const up = await cloudinary.uploader.upload(file.path, (err, res) => {}, {
        use_filename: true,
        unique_filename: false,
        folder: "samples",
        
      });
      url.push(up);
    }
    const format = url.map((p) => ({
      source: p.url,
    }));
    HinhAnh.create(format)
      .then(() => res.status(201).json({ message: "Add images success" }))
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (err) {
    console.log(err);
  }
};

const remove = async (req, res) => {
  try {
    HinhAnh.deleteById(req.params.id)
      .then((response) => {
        if (response) return response;
        return res.status(404).json({ message: "Can not find image" });
      })
      .then((data) => res.status(200).json({ data: data }))
      .catch((err) => res.status(500).json({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export { index, uploads, remove };
