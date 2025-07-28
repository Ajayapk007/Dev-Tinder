const jwt = require('jsonwebtoken');
const User = require("../models/user")

const userAuth = async (req, res, next) =>{
    //read the token from cookies req
    try {
        const {token} = req.cookies;
        if(!token){
            // throw new Error("token is not valid")
            return res.status(401).send("please Login");
        }
        //validate token
        const decoded = await jwt.verify(token, "DEV@TINDER$343");
        //find user
        const {id} = decoded;
        const user = await User.findById(id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user;
        next();
        
    } catch (error) {
        res.status(404).send( error.message );
    }

}

module.exports = {
    userAuth,
}
