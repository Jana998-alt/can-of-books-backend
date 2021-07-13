const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/bestBooks', { useNewUrlParser: true, useUnifiedTopology: true });

//to parse the request body: 
app.use(express.json());


//test of life
app.get('/', testOfLife);

function testOfLife(req, res) {
    res.send('alive')
}



//books schema
const booksSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    img: String,
})

// user schema
const userschema = new mongoose.Schema({
    email: String,
    books: [booksSchema],

})

//Model user data from schema
const userModel = mongoose.model('user', userschema)

//seed some data
function seedUsersCollection() {
    const jana = new userModel(
        {
            email: 'janaosama1300@gmail.com', books: [
                {
                    name: 'The Growth Mindset',
                    description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
                    status: 'FAVORITE FIVE',
                    img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg'
                },
                {
                    name: 'The Momnt of Lift',
                    description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
                    status: 'RECOMMENDED TO ME',
                    img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'
                }
            ]
        }

    )

    jana.save();
}


//route to get the books for the logged in user
app.get('/books', retriveBooksForUser);

function retriveBooksForUser(req, res) {
    let accountEmail = req.query.email;
    userModel.find({ email: accountEmail }, function (error, userData) {
        if (error) {
            res.send('there is an error')
        }
        else {
            res.send(userData.books) // userData has the return value of the find method
        }
    })
}


//route to add a new book to a user in the data base
app.post('./books', postBooksHandler)



function postBooksHandler(request, response) {

    let { email, bookName, bookDescription, bookStatus, bookImg } = request.body;

    userModel.find({ email: email }, (error, items) => {
        try {
            items[0].books.push({
                name: bookName,
                description: bookDescription,
                status: bookStatus,
                img: bookImg,
            })
            items[0].save();
            //no need to respond....but how does the frontend take the array again?
        }
        catch {
            response.send(error);
        }
    })
}


//route to delete a book from the user's data base
app.delete('./books/:id', deleteBookhandler);

function deleteBookhandler(request, response) {
    let id = request.params.id;
    console.log(request.params);
    let email = request.query.email;

    userModel.find({ email: email }, (error, items) => {
        items[0].books.filter(element, () => {
            if (error) {
                response.send(error);
            }
            else {
                return element._id.string() !== id;
            }
        })

    })
}



app.listen(PORT, () => {
    console.log('listening!')
})