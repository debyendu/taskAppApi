
const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();




router.post('/task', auth,  async (req,res) =>{
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        return res.status(200).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/task', auth ,async (req,res) =>{
    const match = {}
    const sort = {}
    if(req.query.completed) { match.completed = req.query.completed === 'true';}
    if(req.query.sortBy) {
        const result = req.query.sortBy.split(':');
        sort[result[0]] = result[1] == "desc" ? -1 : 1;
     }
    try{
        //const result = await Task.find({owner: req.user._id});
        const result = await req.user.populate({
            path: 'getTasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        if(!result) return res.status(404).send("Not Found");
        return res.status(200).send(result.getTasks);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/task/:id', auth ,async (req,res) =>{
    const _id = req.params.id;
    try{
        const result = await Task.findOne({_id, owner : req.user._id});
        if(!result) return res.status(404).send("Not Found");
        return res.status(200).send(result);
    }catch(e){
        res.status(500).send(e);
    }
})

router.patch('/task/:id', auth , async (req,res) =>{
    const reqKey = Object.keys(req.body);
    const key = ['description','completed'];
    const isValidKey = reqKey.every((k)=>key.includes(k));
    const _id = req.params.id;
    if(!isValidKey) return res.status(400).send({'error': 'Invalid data'});
    try{
        const result = await Task.findOne({_id, owner: req.user._id});
        if(!result) return res.status(404).send("Not Found");
        reqKey.forEach((key) => {
           result[key] = req.body[key];
        });
        await result.save();
        //const data = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators: true});
        return res.status(200).send(result);
    }catch(e){
        res.status(500).send(e)
    }

});

router.delete('/task/:id', auth , async (req,res) =>{
    const _id = req.params.id;
    try{
        const result = await Task.findOne({_id, owner: req.user._id});
        if(!result) return res.status(404).send('Not found');
        const data = await Task.findByIdAndDelete(_id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({error:"Bad request"});
    }
});

module.exports = router;