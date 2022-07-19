const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;

const signUp = require("./routes/signup");


var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))



//Auth Routes
app.use("/api", [signUp]);


server.listen(port,  async()=>{
    console.log('server running');
})

app.use("/", (req, res)=>{
     return res.send({
         response : 'server is up and runnning'
     }).status(200);
})
