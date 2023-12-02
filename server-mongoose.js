const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://gorme:Gavinorme@cluster0.s2hjtru.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.log("Couldn't connect to mongodb", error));

const artistSchema = new mongoose.Schema({
    name: String,
    rname: String,
    origin: String,
    genre: String,
});

const Artist = mongoose.model("Artist", artistSchema);

const createArtist = async () => {
    const artist = new Artist({
        name: "Drake",
        rname: "Aubrey Graham",
        origin: "Toronto, Canada",
        genre: "Hip-Hop & R&B",
    });

    const result = await artist.save();
    console.log(result);
};

createArtist();