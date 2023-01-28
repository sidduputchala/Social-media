const express = require('express');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const User = require('./models/user')
cloudinary.config({
    cloud_name: 'dy27czstf',
    api_key :'173764775521668',
    api_secret: 'pQ68Iuyxs-TRLqBPUUHfi1jY2Uk'
});

const app = express();
const dburi = 'mongodb+srv://Siddu:3645@cluster0.hc9mc.mongodb.net/intern?retryWrites=true&w=majority';

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));
//register view engine
app.set('view engine', 'ejs');
// middleware and static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({useTempFiles:true}))
//listen for requests
var cus = {};
app.post('/login', (req, res) => {
    const user = new User(req.body);
        User.findOne({username:user.username})
            .then((result) => {
                if (result == null)
                {
                    user.save()
                    .then((result) => {
                        let flag=true;
                        res.render('login',{flag})
                    }) 
                }
                else
                {
                    const flagU = false;
                    res.render('signup', {flagU})
                }
            })
    });

app.post('/home', (req, res) => {
    const user = new User(req.body);
        User.findOne({username:user.username , password:user.password})
            .then((result) => {
                if (result != null)
                {
                    cus = result
                    res.render('home',{result:null,follow:1})
                }
                else
                {
                    let flag = false;
                    res.render('login', {flag})
                }
            })
    });
app.post('/search',(req,res)=>{
    User.findOne({username:req.body.name})
    .then((result)=>{
        if(result!=null)
        {
            if(cus.following.includes(req.body.name))
            {
                res.render('home',{result,follow:0})
            }
            else
            res.render('home',{result,follow:1})
        }
        else
        {
            res.render('home',{result:null,follow:1})
        }
    })
})
app.post('/follow',(req,res)=>{ 
        cus.following.push(req.body.name)
        User.findOneAndUpdate({ username:cus.username}, { following: cus.following}, (error, data) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(data);
            }
        })
        User.findOne({username:req.body.name})
        .then((result)=>{
             result.followers.push(cus.username)
             User.findOneAndUpdate({username:req.body.name},{followers:result.followers}, (error, data) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.render('home',{result:null,follow:0})
                }
            })
             })
    })

app.post('/unfollow',(req,res)=>{ 
         const index = cus.following.indexOf(req.body.name)
         const x = cus.following.splice(index,1)
        User.findOneAndUpdate({ username:cus.username}, { following: cus.following}, (error, data) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(data);
            }
        })
        User.findOne({username:req.body.name})
        .then((result)=>{
             const index = result.followers.indexOf(cus)
             result.followers.splice(index,1)
           User.findOneAndUpdate({username:req.body.name},{followers:result.followers}, (error, data) => {
            if (error) {
                console.log(error);
            }
            else {
                res.render('home',{result:null,follow:1})
            }
        })
    })   
})
app.post("/upload",async(req,res)=>{
    const file = req.files.image
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        cus.posts.push(result.url)
        User.findOneAndUpdate({username:cus.username},{posts:cus.posts},(error,data)=>{
            if(error)
            {
                console.log(error)
            }
            else
            {
                res.render('home',{result:null,follow:1})
            }
        })
    })
})
app.post('/feed',(req,res)=>{
 
 User.findOne({username:req.body.name})
 .then((result)=>{
    res.render('feed',{result:result.posts})
 })
})

const update = async() =>{
 await User.findOne({username:cus.username})
 .then((result)=>{
    console.log("udaea")
    cus = result
 })
}
app.get('/', (req, res) => {
    const flag = true;
    res.render('login',{flag})
})

app.get('/home', (req, res) => {
    res.render('home', { result:null,follow:1});
})

app.get('/login', (req, res) => {
    flag=true;
    res.render('login',{flag})
})
app.get('/signup', (req, res) => {
    const flagU = true;
    res.render('signup', {flagU });
})
app.get('/profile',(req,res)=>{
    update()
    setTimeout(() => {
        res.render('profile',{cus})
    }, 500);
})
app.get('/followers',(req,res)=>{
    res.render('followers',{result:cus.followers})
})
app.get('/following',(req,res)=>{
    res.render('following',{result:cus.following})
})
app.get('/posts',(req,res)=>{
    res.render('posts',{result:cus.posts})
})
//404 page
app.use((req, res) => {
    res.status(404).render('404')
});
