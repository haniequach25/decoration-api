import passportJwt from 'passport-jwt'
import dotenv from "dotenv";
dotenv.config();
const jwtStrategy = passportJwt.Strategy
const extractJwt = passportJwt.ExtractJwt;

const jwtOptions = {
    jwtFromRequest:extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}

const ppjwt = new jwtStrategy(jwtOptions, function(jwt_payload,done){
    done(null, jwt_payload)
})
export default ppjwt