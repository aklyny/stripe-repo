const express = require('express');
const keys = require('./config/keys');
const bodyParser= require('body-parser');
const stripe = require('stripe')(keys.stripeSecretKey);
const exbphbs = require('express-handlebars');


const app =express();

app.engine('handlebars',exbphbs({defaultLayout:'main'}))
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(`${__dirname}/public`))
app.get('/',(req,res)=>{
    res.render('index',{
        stripePublishableKey:keys.stripePublishableKey
    })
})

app.post('/charge',(req,res)=>{
    const amount =2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name: 'Sri Bharathi Dass',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
    })
    .then(customer=>stripe.charges.create({
        amount,
        description:'Stripe API Tutorial',
        currency:'usd',
        customer:customer.id,
    }))
    .then(charge => res.render('success'))
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`The server is running on ${port}`)
})