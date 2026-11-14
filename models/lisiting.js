const mongoose = require("mongoose");
const Reviews = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
 title:{
        type:String ,
        required: true
    },
description:{
        type:String
    },
image:{
    filename :{
      type:String,
      default:"listingimage"
    },
    url:{
        type:String,
        default:"https://unsplash.com/photos/stairway-to-the-sea-with-lush-greenery-and-flowers-9JqliCnGa4o",
    set:(v)=> v == ""? "https://unsplash.com":v,
    }
    
},
price:{
    type:Number
},
location:{
    type:String
},
country:{
    type:String
},
reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
    owner:{
         type:Schema.Types.ObjectId,
         ref:"User"
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id :{$in:listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;