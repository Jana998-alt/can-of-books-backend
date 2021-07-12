const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/bestBooks', { useNewUrlParser: true, useUnifiedTopology: true });


//test of life
app.get('/',testOfLife);

function testOfLife(req,res){
    res.send('alive')
}

//books schema
const booksSchema = new mongoose.Schema({
    name : String,
    description: String,
    status: String,
    img: String,
})


// user schema
const userschema = new mongoose.Schema({
    email : String,
    books : [booksSchema],

})

const userModel = mongoose.model('user',userschema)

function seedUsersCollection(){
    const jana = new userModel(
        {email: 'janaosama1300@gmail.com', books: [
                { name: 'The Growth Mindset', 
                description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.', 
                status: 'FAVORITE FIVE', 
                img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg' },
                { name: 'The Momnt of Lift', 
                description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.', 
                status: 'RECOMMENDED TO ME', 
                img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'}
              ]}
             
    )
    
    jana.save();
}

// seedUsersCollection();

app.get('/books',retriveBooksForUser);

function retriveBooksForUser(req,res){
    let accountEmail = req.query.email;
    userModel.find({email:accountEmail},function(error,userData){
        if(error){
            res.send('there is an error')
        }
        else {
            res.send(userData) // userData has the return value of the find method
        }
    })
}


app.listen(PORT, ()=>{
    console.log('listening!')
})