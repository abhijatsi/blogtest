var express = require("express");
var app = express();
var port = 3000;

var bodyParser = require("body-parser");
var str = "temp";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo", function(err){
    if (!err){
        console.log("connect to MongoDB");
    } else {
        throw err;
    }
});

var nameSchema = new mongoose.Schema({
    firstName: String
}, {collection:"USER"});

var User = mongoose.model("User", nameSchema);

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.route("/getname").get(function(req,res) {
    User.findOne({}, function(err, person){
        if (err) return err;
        str = person.firstName;
        console.log("Value of new Str is " + str);
    })    
    res.send(str);
});


app.post("/addname", (req,res) => {
    console.log(req.body);
    User.create({
        firstName: "test"
    }).then(item=> {
        User.findOne({}, function(err, person){
            if (err) return err;
            str = person;
            console.log("Value of new Str is " + str);
            res.send("item saved in database" + str);
        })    
    })
    .catch(err =>{
        res.status(400).send("Unable to save to database");
    });
});

app.listen(port, ()=> {
    console.log("Server listening on port " + port);
});