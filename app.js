const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const ejsMate = require("ejs-mate")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override")
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
main().
then(()=>{
    console.log("Connected to DB")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

 
}
app.listen(8080,()=>{
    console.log("Server is listening at port 8080")
})
//Root route
app.get("/",(req,res)=>{
    res.send("Root is working!!")
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 3500,
//         location : "Calangute, Goa",
//         country : "India"
//     });
//     await sampleListing.save();

//     console.log("Sample was saved");
//     res.send("successfully saved the info")
// })


//index route
app.get("/listing", async (req,res)=>{
    const allListings = await Listing.find()
    res.render("listings/index.ejs",{allListings})
})


//new route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//edit route
app.put("/listing/:id",async(req,res)=>{
    let id = req.params.id;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listing/${id}`);
    
})


//delete route
app.delete("/listing/:id",async(req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listing")
})

app.post("/listing",async(req,res)=>{
    // let title1 = req.body.title;
    // let description1 = req.body.description;
    // let price1 = req.body.price;
    // let location1 = req.body.location;
    // let country1 = req.body.country;
    // let image = req.body.image
    // console.log("hiiii")
    // let op = req.body.listing;
    // console.log(op);
   // let listing = req.body.listing;
    const newlisting = new Listing(req.body.listing);
    // console.log(listing)
    // let sampleListing = new Listing({
    //     title : listing.title,
    //     description : listing.description,
    //     price : listing.price,
    //     location : listing.location,
    //     country : listing.country,
    //     image : listing.image
    // });
    await newlisting.save();
    res.redirect("/listing")
})


app.get("/listing/:id/edit",async(req,res)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})





//show route 
app.get("/listing/:id", async(req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.use((req,res,next)=>{
    res.send("You are looking for a page that doesn't exist!");
    next();
})