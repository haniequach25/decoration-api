
import HinhAnh from './HinhAnh.js'
import DanhMucBlog from './DanhMucBlog.js'
import Blog from './Blog.js'
import Comment from './Comment.js'
import TaiKhoan from './TaiKhoan.js'
function route(app){
    app.use('/api/hinhanhs',HinhAnh)
    app.use('/api/danhmucblogs',DanhMucBlog)
    app.use('/api/blogs',Blog)
    app.use('/api/comments',Comment)
    app.use('/api/taikhoans',TaiKhoan)

}
export default route