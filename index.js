const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.end("working!!!");
});

app.listen(process.env.PORT | 3300,()=>{console.log("server is up!")});