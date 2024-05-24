const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        let token = req.session.authorization['token']
        jwt.verify(token,"SECRET",function(err,value){
            if(!err)
            {
                req.user = value
                next()
            }else{
                res.status(401).json({message:"Unauthorized"})
            }
        })
    }else{
        res.status(401).json({message:"Unauthorized"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
