const express= require("express");
const bodyParser=require("body-parser") //body parser should be installed using npm to fetch the data based on the input
const request=require("request");
const https=require("https");

const app=express();
app.use(express.static("public")); //inorder to use static css and js files
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html"); //dirname is a contant that gives the current file location

});

app.post("/", function(req, res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }

            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/628ac693ef";
    const options={
        method:"POST",
        auth:"wingit:d32d974f55d3703e72852cfc0e700313-us21"
    }

    const request=https.request(url, options, function(response){  //to post user entering fields to mailchimp
        if (response.statusCode==200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();



});


app.post("/failure", function(req, res){
    res.redirect("/")
})




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});

//d32d974f55d3703e72852cfc0e700313-us21 -API key
// 628ac693ef-unique ID