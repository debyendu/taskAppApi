const mongoose = require('mongoose');
//var validator = require('validator');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    }
},{
    timestamps: true
})


const Task =  mongoose.model('task', taskSchema)

module.exports = Task;