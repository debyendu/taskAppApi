require('./src/db/mongoose')
const express = require('express');
//const multer = require('multer');
const taskRouter = require('./src/routers/task');
const userRouter = require('./src/routers/user');
const port = process.env.PORT;
const app = express();

// app.use((req,res,next) =>{
//     res.status(503).send('In maintanance');
// })

// const upload = multer({
//     dest:'images',
//     limits:{
//         fieldSize:10000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.endsWith('.pdf')) return cb( new Error('Must be a pdf'));
//         cb(null,true);
//     }
// });

// app.post('/upload', upload.single('upload'), (req,res) =>{
//     res.send();
// },(error,req,res,next) =>{
//     res.status(400).send(error.message);
// });

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);




// const deleteTaskAndCount = async (id) =>{
//     const deletedData = await Task.findByIdAndDelete(id);
//     const count = await Task.count({completed: false}).count();
//     return count;
// };
// deleteTaskAndCount('6001a3df1d38154e8c7f3af0').then(res =>{
//     console.log(res);
// }).catch(e =>{
//     console.log(e);
// })

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

