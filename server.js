const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
    .connect("mongodb+srv://chrisdambrosio:XVw06VY21Pm2GaBp@cluster0.riboegr.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch((error) => console.log("Couldn't connect to mongodb", error));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const artistSchema = new mongoose.Schema({
    name: String,
    rname: String,
    origin: String,
    genre: String,
});

const Artist = mongoose.model("Artist", artistSchema);



app.get("/api/artists", (req, res) => {
    getArtists(res);
});

const getArtists = async(res) => {
    const artists = await Artist.find();
    res.send(artists);
};



app.get("/api/artists/:id", (req, res) => {
    getArtist(res, req.params.id);
});

const getArtist = async(res) => {
    const artist = await Artist.findOne({ _id: id })
    res.send(artist);
};

app.post("/api/artists", upload.single("img"), (req, res)=> {
    const result = validateArtist(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const artist = new Artist({
        name: req.body.name,
        rname: req.body.rname,
        origin: req.body.origin,
        genre: req.body.genre,
    })
    
    

    if(req.file) {
        artist.img = "images/" +req.file.filename;
    }
    createArtist(res, artist);
});

const createArtist = async (res, artist) =>{
    const result = await artist.save();
    res.send(artist);
};



app.put("/api/artists/:id", upload.single("img"), (req, res) => {

    
    
    const result = validateArtist(req.body);
    console.log(result);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateArtist(req,res);
});

const updateArtist = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        rname: req.body.rname,
        origin: req.body.origin,
        genre: req.body.genre,
    }

    if(req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }
    const result = await Artist.updateOne({_id:req.params.id}, fieldsToUpdate);
    const artist = await Artist.findById(req.params.id);
    res.send(artist);
};

app.delete("/api/artists/:id", (req, res) => {
    removeArtists(res, req.params.id);
});

const removeArtists = async (res, id) => {
    const artist = await Artist.findByIdAndDelete(id);
    res.send(artist);
};

function validateArtist(artist) {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        rname: Joi.string().min(3).required(),
        origin: Joi.string().min(3).required(),
        genre: Joi.string().min(3).required(),
    });

    return schema.validate(artist);
} 


app.listen(3000, () => {
    console.log("Listening");
});