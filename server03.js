const Datastore = require("nedb");
const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");

const PORT = parseInt(process.env.PORT) || 3000;

function toGoodString(data) {
    return ['number', 'string'].includes(typeof (data)) ? data.toString() : JSON.stringify(data);
}

function respHandle(name, printResp = true) {
    const currentTime = new Date().getMilliseconds();
    return (err, resp) => {
        if (!err) {
            console.log(`${name.toUpperCase()} DONE IN ${new Date().getMilliseconds() - currentTime} ms`);
            if (printResp) {
                console.log(toGoodString(resp));
                console.log("-----------------------------");
            }
        } else {
            console.log(`${name.toUpperCase()} ERROR: ${toGoodString(err)}`);
        }
    }
}

app = express();
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    partialsDir: 'views/partials',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

function response(name, ...args) {
    return new Promise((res, err) => coll1[name](...args, (erre, data) => {
        if (erre) err(erre);
        else res(data);
    }));
}

const coll1 = new Datastore({
    filename: 'db/kol02.db',
    autoload: true
});

const rootContext = {
    values: ["ubezpieczony", "benzyna", "uszkodzony", "napęd 4x4"]
};

app.get("/", async (req, res) => {
    res.render("index2.hbs", { ...rootContext, data: await response('find', {}) });
});

const toRBool = e => e === undefined ? 'NO' : e === "BRAKDANYCH" ? "" : ['on', 'tak', 'yes'].includes(e.toLowerCase()) ? "YES" : "NO";

app.get('/add', async (req, res) => {
    let newObject = {};
    for (let v of rootContext.values) {
        newObject[v] = toRBool(req.query[v]);
    }
    await response("insert", newObject);
    res.redirect("/");
});

app.get("/delete", async (req, res) => {
    if (!req.query.id) {
        res.redirect('/');
        return;
    }
    await response("remove", { _id: req.query.id }, {});
    res.redirect("/");
});

app.get('/edit', async (req, res) => {
    if (!req.query.id) {
        res.redirect('/');
        return;
    }
    const data = await response('find', {});
    for (let e of Object.keys(data)) {
        if (data[e]._id === req.query.id) {
            data[e].edited = true;
        }
    }
    res.render("index2.hbs", { ...rootContext, data });
});

app.get('/doEdit', async (req, res) => {
    if (!req.query.id) {
        res.redirect('/');
        return;
    }
    let newObject = {};
    for (let v of rootContext.values) {
        newObject[v] = toRBool(req.query[v]);
    }

    await response("update", { _id: req.query.id }, { $set: newObject })
    res.redirect("/");
});

app.listen(PORT, respHandle("listen on " + PORT, false));