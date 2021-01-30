require('./src/db/mongoose')
const express = require('express');
const Task = require('./src/models/task');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post('/task', (req,res) =>{
    const task = new Task(req.body);
    task.save().then(result =>{
        res.status(200).send(result);
    }).catch(e =>{
        res.status(400).send(e);
    })
})

app.get('/task', (req,res) =>{
    Task.find({}).then(result =>{
        if(!result) return res.status(404).send("Not found")
        res.status(200).send(result);
    }).catch(e =>{
        res.status(500).send("Connection error");
    })
})

app.get('/task/:id', (req,res) =>{
    const _id = req.params.id;
    Task.findById(_id).then(result =>{
        if(!result) return res.status(404).send("Not found")
        res.status(200).send(result);
    }).catch(e =>{
        res.status(500).send("Connection error");
    })
})


const deleteTaskAndCount = async (id) =>{
    const deletedData = await Task.findByIdAndDelete(id);
    const count = await Task.count({completed: false}).count();
    return count;
};
deleteTaskAndCount('6001a3df1d38154e8c7f3af0').then(res =>{
    console.log(res);
}).catch(e =>{
    console.log(e);
})

// Task.findByIdAndDelete('6001a3bd0c7e2d38807f5b85').then(result =>{
//     console.log(result)
//     return Task.find({completed: false}).countDocuments()
// }).then(res =>{
//     console.log(res);
// }).catch(e =>{
//     console.log(e);
// })


//start the app
app.listen(port, () =>{
    console.log("App is running in: " +port);
});

