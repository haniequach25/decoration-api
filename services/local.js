import LocalStrategy from "passport-local";
import TaiKhoan from "../server/models/TaiKhoan.js";
import bcrypt from "bcrypt";

const pplocal = LocalStrategy.Strategy;

const passportLocal = new pplocal(
  { session: false, usernameField: 'email', passwordField: 'password' },
  async (email, password, callback) => {
    // We use default {username: "catlover", password: "cat", id: 1} to authenticate.
    // You should use database to check for user credentials.]
    console.log("Before call back user")
    try{
     
    const user = await TaiKhoan.findOne({ email: email }).populate("Avatar");
    if (!user) {
        callback(null, false);
        return;
    }
    console.log("Hello", user.password)
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatch)
    // const isPasswordMatch = true
    if (!isPasswordMatch) {
        callback(null, false);
        return;
    }
    callback(null, { user });
    }catch(err){
      console.log(err)
    }
  }
);
export default passportLocal