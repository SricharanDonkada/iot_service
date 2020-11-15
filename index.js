const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const { actionsSDK } = require('actions-on-google');

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



app.get('/favicon.ico',(req,res)=>{
    res.status(404);
    res.end();
})


// LEDs APP

var leds = {red:false, blue:false, green:false, yellow:false};

app.post('/leds',(req,res)=>{
    console.log(req.body);
    let color =  req.body.queryResult.parameters.color;

    if(leds[color] == undefined){
        res.json({fulfillmentText:`${color} LED is not there`});
    }
    
    // TURN ON INTENT
    if(req.body.queryResult.intent.name == "projects/nodemcu-colour-led/agent/intents/0bf9c09d-4e30-4646-b500-ff73aa0f0ef1"){
        if(leds[color]){
            res.json({fulfillmentText:`${color} LED is already switched on`});
        }
        else{
            res.json({fulfillmentText:`switching on ${color} LED`});
            leds[color] = true;
        }
    }
    else if(req.body.queryResult.intent.name == 'projects/nodemcu-colour-led/agent/intents/b830d60b-3abe-4cd7-907a-448d5ff40ead'){
        if(!leds[color]){
            res.json({fulfillmentText:`${color} LED is already switched off`});
        }
        else{
            res.json({fulfillmentText:`switching off ${color} LED`});
            leds[color] = false;
        }
    }
    
});

app.get('/*',(req,res)=>{
    console.log("got a get request");
    res.end();
})

app.post('/*',(req,res)=>{
    console.log("got a post request");
    console.log(req.body);
    res.end();
})

app.listen(process.env.PORT || 3300,()=>{console.log("server is up!")});