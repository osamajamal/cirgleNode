const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const signUp = require("./routes/signup");


var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))



//Auth Routes
app.use("/api", [signUp]);



const PORT = process.env.PORT || 3100;
server.listen(PORT, async () => {
  console.log(`Server has started on PORT: ${PORT}`);
});

app.use("/", (req, res)=>{
     return res.send({
         response : 'server is up and runnning'
     }).status(200);
})
