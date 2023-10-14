
const mongoose = require("mongoose");
module.exports = () => {
    // connect to the mongod instance to start the mongodb database server
    mongoose.connect(process.env.db_connection_string, { useNewUrlParser: true });
    // if get the result object from the connection 
    const isConnected = mongoose.connection;
    isConnected.on("error", () => console.log("<< --- 🤢|= The connection to the mongo database has been raised error 💥"));
    isConnected.on("open", () => {
        console.log("<< ----👌|= Connection to database is completed ✔")
        console.log();
        console.log("<<_______________________________________________________________________________________________________________>>");
    })
    // end of the configuration connection db
}