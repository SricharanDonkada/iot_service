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

app.post('/leds',(req,res)=>{
    console.log(req.body);
    res.end();
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