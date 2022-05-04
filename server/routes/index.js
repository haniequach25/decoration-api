import SanPham from "./SanPham.js";
import DonHang from "./DonHang.js";
import TaiKhoan from "./TaiKhoan.js";
import HinhAnh from "./HinhAnh.js";
import DanhMucSP from "./DanhMucSP.js";
import DanhMucBlog from "./DanhMucBlog.js";
import KhachHang from "./KhachHang.js";
import Blog from "./Blog.js";
function route(app) {
  try {
    app.use("/api/sanphams", SanPham);
    app.use("/api/taikhoans", TaiKhoan);
    app.use("/api/hinhanhs", HinhAnh);
    app.use("/api/danhmucsps", DanhMucSP);
    app.use("/api/danhmucblogs", DanhMucBlog);
    app.use("/api/donhangs", DonHang);
    app.use("/api/khachhangs", KhachHang);
    app.use("/api/blogs", Blog);
  } catch (err) {
    console.log(err);
  }
}
export default route;
