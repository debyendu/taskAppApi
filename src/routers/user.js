const express = require('express');
const multer  = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');
const mail = require('../emails/account');
const router = express.Router();



const upload = multer({
    limits: 10000
});

router.post('/user/me/avater', auth ,upload.single('upload'), async (req,res) =>{
    console.log(req.file);
    req.user.avater = req.file.buffer;
    await req.user.save()
    res.send();
}, (error) =>{
    res.status(400).send("Wrong")
});

router.delete('/user/me/avater/del', auth , async (req,res) =>{
    req.user.avater = undefined;
    await req.user.save()
    res.send();
}, (error) =>{
    res.status(400).send("Wrong")
});

router.get('/user', auth, async (req,res) =>{
    try{
        res.status(200).send(req.user);
    }catch(e){
        res.status(400).send("Not found");
    }
})


router.post('/signup' , async (req,res) =>{
    const user = new User(req.body);
    try{
        const token = await user.getToken();
        mail.emailFormat(req.body.email,"Leomord","Welcome","Thanks for signup");
        await user.save();
        res.status(200).send({user,token});
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/user/login', async (req,res) =>{
    try{
        const user = await User.findByCre(req.body.email,req.body.password);
        const token = await user.getToken();
        res.status(200).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/user/logout', auth ,async (req,res) =>{
    try{
        const userAuth = req.headers.auth;
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== userAuth;
        })
        await req.user.save();
        res.status(200).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/user/del', auth ,async (req,res) =>{
    try{
        mail.emailFormat(req.body.email,"Leomord","USer removerd","Tell me what went wrong!");
        await req.user.remove();
        res.status(200).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch('/user/update', auth ,async (req,res) =>{
    const dataSets = ["email","password"];
    const reqkeys = Object.keys(req.body);
    const isValid = dataSets.every( (dataSet) => reqkeys.includes(dataSet));
    try{
        if(!isValid) throw new Error("key wrong");
        reqkeys.forEach( (key) =>{
            req.user[key] = req.body[key];
        })
        await req.user.save();
        res.status(200).send(req.user);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
})


router.post('/user/logoutAll', auth ,async (req,res) =>{
    try{
        const userAuth = req.headers.auth;
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})


module.exports = router;