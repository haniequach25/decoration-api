import passport from 'passport'
import LocalStrategy from '../customer-local.js'
import jwtStrategy from '../jwt.js'
const passportClass = passport.Passport
const passPortCustomer = new passportClass()
passPortCustomer.use(LocalStrategy);
passPortCustomer.use(jwtStrategy)
export default passPortCustomer