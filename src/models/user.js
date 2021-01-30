const mongoose = require('mongoose');
const validatior = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (user) =>{
            if(!validatior.isEmail(user)) throw new Error("Email is incorrent"); 
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate: (user) =>{
            if(validatior.contains(user,'password')) throw new Error("Password can't have password");
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avater:{
        type: Buffer
    }
},{
    timestamps: true
})

schema.virtual('getTasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
});


schema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    delete userObj.tokens;
    delete userObj.password;
    return userObj;
}

schema.methods.getToken = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id.toString() },process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}


schema.statics.findByCre = async (email,pass) =>{
    const user = await User.findOne({email});
    if(!user) throw new Error('Unable to login');
    const password = await bcrypt.compare(pass,user.password);
    if(!password) throw new Error('Unable to login-pass');
    return user;
}


schema.pre('save', async function(next){
    const user = this;
    if( user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8); 
    }
    next();
});
//delete task whwen user is deleted
schema.pre('remove', async function (next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('user', schema);

module.exports = User;