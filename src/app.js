const express = require('express');

const app = express();

app.listen(8080,()=>{
    console.log("Server is successfully running on port 8080");
});

app.use('/test',(req, res)=>{
    res.send("Hello From server");
})
app.use('/profile',(req, res)=>{
    res.send("This is your profile");
})
app.use('/',(req, res)=>{
    res.send("Dashboard");
})
