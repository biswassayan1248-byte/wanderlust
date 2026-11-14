const mongoose = require("mongoose");
const initdata = require("./data.js");

const Listing = require("../models/lisiting.js");

main()
.then(()=>{
    console.log("connection to db");
}).catch((err)=>{
    console.log(err);
});


async function main() {
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}

const initDB = async()=>{
    await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner :'6ab9783dc6e055c197aaa499'

    }));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
};

    initDB();
