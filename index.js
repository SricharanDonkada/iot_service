const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));


app.get('/favicon.ico', (req, res) => {
    res.status(404);
    res.end();
})


// LEDs APP

var leds = { red: false, blue: false, green: false, orange: false };

app.post('/leds', (req, res) => {
    console.log(req.body);
    console.log(req.body.intent.params.color);
    if (req.body.intent.params.color == undefined) {
        res.json({ session: req.body.session, prompt: { firstSimple: { speech: `I didn't get you, could you please repeat what you said?` } } });
    }
    else {
        let color = req.body.intent.params.color.resolved;

        if (leds[color] == undefined) {
            res.json({ session: req.body.session, prompt: { firstSimple: { speech: `${color} LED is not there` } } });
        }

        // TURN ON INTENT
        if (req.body.intent.name == "ON") {
            if (leds[color]) {
                res.json({ session: req.body.session, prompt: { firstSimple: { speech: `${color} LED is already switched on` } } });
            }
            else {
                res.json({ session: req.body.session, prompt: { firstSimple: { speech: `switching on ${color} LED` } } });
                leds[color] = true;
            }
        }
        else if (req.body.intent.name == 'OFF') {
            if (!leds[color]) {
                res.json({ session: req.body.session, prompt: { firstSimple: { speech: `${color} LED is already switched off` } } });
            }
            else {
                res.json({ session: req.body.session, prompt: { firstSimple: { speech: `switching off ${color} LED` } } });
                leds[color] = false;
            }
        }
    }
});

app.get('/leds', (req, res) => {
    let str = "";
    if (leds["red"]) {
        str += "o";
    }
    else {
        str += "f";
    }
    if (leds["green"]) {
        str += "o";
    }
    else {
        str += "f";
    }
    if (leds["blue"]) {
        str += "o";
    }
    else {
        str += "f";
    }
    if (leds["orange"]) {
        str += "o";
    }
    else {
        str += "f";
    }
    res.end(str);

})

app.get('/leds/reset',(req,res)=>{
    leds = { red: false, blue: false, green: false, orange: false };
    res.end("reset complete");
});

app.get('/', (req, res) => {
    console.log("got a get request");
    res.end();
})





//RC CAR

io.on('connection',(socket)=>{
    console.log('client is connected');

    socket.on('move-front',()=>{
        console.log('front');
        socket.broadcast.emit('move-front');
    });

    socket.on('move-back',()=>{
        console.log('back');
        socket.broadcast.emit('move-back');
    });

    socket.on('turn-left',()=>{
        console.log('left');
        socket.broadcast.emit('turn-left');
    });

    socket.on('turn-right',()=>{
        console.log('right');
        socket.broadcast.emit('turn-right');
    });

    socket.on('rotate-left',()=>{
        console.log('rotate-left');
        socket.broadcast.emit('rotate-left');
    });

    socket.on('rotate-right',()=>{
        console.log('rotate-right');
        socket.broadcast.emit('rotate-right');
    });

    socket.on('stop',()=>{
        console.log("STOP");
        socket.broadcast.emit('stop');
    });

    socket.on('disconnect',()=>{
        console.log("client is disconnected");
    });

});

http.listen(process.env.PORT || 3300, () => { console.log("server is up!") });