import passport from 'passport'
import LocalStrategy from '../local.js'
import jwtStrategy from '../jwt.js'
const passportClass = passport.Passport
const passPortUser = new passportClass()
passPortUser.use(LocalStrategy);
passPortUser.use(jwtStrategy)
export default passPortUser