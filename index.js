const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const { actionsSDK } = require('actions-on-google');

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



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

app.get('/', (req, res) => {
    console.log("got a get request");
    res.end();
})


app.listen(process.env.PORT || 3300, () => { console.log("server is up!") });