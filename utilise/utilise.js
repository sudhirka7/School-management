const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/session_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/session_db" }),
        cookie: { secure: false },
    })
);
