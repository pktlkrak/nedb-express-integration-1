const Datastore = require("nedb");


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

const coll1 = new Datastore({
    filename: 'db/kol01.db',
    autoload: true
});

const doc = {
    a: "a2",
    b: "b3"
};

coll1.insert(doc, respHandle("insert"));

coll1.find({ _id: "yYuqXqOyjV4LkLvR" }, respHandle("find"))