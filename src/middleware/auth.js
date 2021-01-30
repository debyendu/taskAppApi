const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    try{    
        const authToken = req.headers.auth;
        const decode = await jwt.decode(authToken,process.env.JWT_SECRET);
        const findUser = await User.findOne({_id: decode._id, "tokens.token": authToken});
        if(!authToken || !findUser) throw new Error();
        req.user = findUser;
        next();
    }catch(e){
        res.status(400).send("Invalid token");
    }
}

module.exports = auth;