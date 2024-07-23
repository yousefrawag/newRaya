const userSchema = require("../model/userschema")
const jwt  = require('jsonwebtoken')
const autentcatuserLogin = async (req, res, next) => {
    let Token;
    Token = req.cookies.jwt
    console.log(Token)
    if(Token) {
        const decoded = jwt.verify(Token , process.env.REFRASH_TOKEN)
        req.user = await userSchema.findById(decoded.id)
        console.log(req.user)
        next()
    }else{
        res.send("you must be login to get this page")
    }
}
module.exports = autentcatuserLogin