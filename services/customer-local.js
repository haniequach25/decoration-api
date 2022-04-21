import LocalStrategy from "passport-local";
import KhachHang from "../server/models/KhachHang.js";
import bcrypt from "bcrypt";

const pplocal = LocalStrategy.Strategy;

const passportLocal = new pplocal(
  { session: false, usernameField: 'email', passwordField: 'password' },
  async (email, password, callback) => {
    // We use default {username: "catlover", password: "cat", id: 1} to authenticate.
    // You should use database to check for user credentials.]
    
    try{
      console.log("Before call back customer")
    const customer = await KhachHang.findOne({ email: email });
    if (!customer) {

        callback(null, false);
        return;
    }
    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    
    // const isPasswordMatch = true
    if (!isPasswordMatch) {
        callback(null, false);
        return;
    }
   
    callback(null, { customer });
    }catch(err){
      console.log(err)
    }
  }
);
export default passportLocal