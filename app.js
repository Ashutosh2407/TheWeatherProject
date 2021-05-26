const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const sslRedirect = require('heroku-ssl-redirect').default
var port = process.env.PORT || 3000;

require('dotenv').config()

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html");
})


app.post("/",function(req,res){

  const query = req.body.cityName;

  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+process.env.API_KEY+"&units="+unit;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p><h1>The temperature in "+ query +" is "+temperature + " degree celsius.</h1>");
      res.write("<p><h1>The weather in "+ query +" is "+weatherDescription + ".</h1>");
      res.write("<img src ="+ iconURL +">");
      res.send();
    })
  })
});




app.listen(port, function(){
  console.log("Server is running on port 3000");
})
