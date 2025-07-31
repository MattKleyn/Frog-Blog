import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/* HTTP request routing */

app.delete("/delete", (req, res) => {
    console.log('got a delete request')
    /*res.render("delete_post_form.ejs") */
});

app.patch("/edit", (req, res) => {
    console.log('got a patch request')
    /*res.render("edit_post_form.ejs") */
});

app.post("/create_post", (req, res) => {
    console.log("post request form data JS object: ", req.body);

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        jsObjectArray.push(req.body);
        const obJS = JSON.stringify(jsObjectArray);

        /*console.log("jsArray.push: ", jsObjectArray);
        console.log("pushed JS object stringify: ", obJS); */

        fs.writeFile("./data/posts.json", obJS, (err) => { 
            if (err) throw (err);
            console.log("posts.json updated")
        })
    });
    
    res.render("index.ejs", req.body); 
});

app.get("/new_post_form", (req, res) => {
    console.log("Display create post form");
    res.render("new_post_form.ejs")
});

app.get("/", (req, res) => {
    console.log("Display homepage");
   
    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        let arrayLength = [jsObjectArray.length];
        let latestPost = jsObjectArray[arrayLength - 1];

        /*console.log("read .json: ", data); 
        console.log("array length: ", arrayLength);       
        console.log(".json parsed: ", jsObjectArray);
        console.log("latest Post: ", latestPost);*/

        res.render("index.ejs", latestPost)
    });
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});