import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { stringify } from "querystring";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/* HTTP request routing */
/*delete post form, do as button on view article page*/
app.delete("/delete", (req, res) => {
    console.log('got a delete request');

    /* splice or toSpliced method seems suitable */
    const data = {
        title: "delete",
        body: "delete",
        author: "delete"
    };
    res.render("view_post.ejs", data) 
});




/* need a form field to pass an argument, parse argument, search through array to find matching argument, display data. */
/* Then user to make edit, click save button, parse through arguments, add back to array (at index what?), stringify array, write to file */
/* display edit post form, Edit post, save, and display edited post pagedo as button on view article page*/
app.patch("/edit", (req, res) => {
    console.log('got a patch request');
    const data = {
        title: "Blob",
        body: "bobberson",
        author: "Hank Hill"
    };
    res.render("view_post.ejs", data) 
});



/* break after two searches??? */
/* view article, using get request doesnt give valid form data, returns undefined*/
app.post("/view", (req, res) => {
    console.log("Displaying article");

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const foundPost = jsObjectArray.find(post => post.title === req.body.search);
        console.log(foundPost);

        const postInfo = {
            title: foundPost.title,
            body: foundPost.body,
            author: foundPost.author
        };

        res.render("view_post.ejs", postInfo)
    });
});

/*New post submission. Save, and display new post.*/
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

    res.render("view_post.ejs", req.body);
});

/*Display create post form*/
app.get("/new_post_form", (req, res) => {
    console.log("Display create post form");
    res.render("new_post_form.ejs")
});

/*Display Home page*/
app.get("/", (req, res) => {
    console.log("Display homepage");
   
    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const arrayLength = [jsObjectArray.length];
        const latestPost = jsObjectArray[arrayLength - 1];

        const posts = {
            title: latestPost.title,
            body: latestPost.body,
            author: latestPost.author,
            quantity: arrayLength,
            recentPosts: jsObjectArray
        };

        /*
        console.log("read .json: ", data); 
        console.log("array length: ", arrayLength);       
        console.log(".json parsed: ", jsObjectArray);
        console.log("latest Post: ", latestPost);
        console.log("posts: ", posts);
        */

        res.render("index.ejs", posts)
    });
});

/*Server connection*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});