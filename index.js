import express from "express";
import bodyParser from "body-parser";
import fs from "fs";


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

/* view article by homepage link, use article unique id */
app.get("/posts/:id", (req, res) => {

    console.log(req.params.id);

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const foundPost = jsObjectArray.find(post => post.id === req.params.id);

        console.log("User searched for: ", foundPost);

        if (!foundPost) {
            return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
        };

        const postInfo = {
            title: foundPost.title,
            body: foundPost.body,
            author: foundPost.author
        };

        res.render("view_post.ejs", postInfo)        
    });
});

/* Search bar, article by title, using Post req instead of get request, doesnt give valid form data, returns undefined*/
app.post("/view", (req, res) => {

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const searchTerm = req.body.search.toLowerCase();
        const foundPost = jsObjectArray.find(post => post.title.toLowerCase() === searchTerm);

        console.log("User searched for: ", searchTerm);

        if (!foundPost) {
            return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that title.", author: "Try searching something else"})
        };

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

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const id = Date.now().toString() + Math.floor(Math.random() * 1000);
        const newPost = {
            id: id,
            title: req.body.title,
            body: req.body.body,
            author: req.body.author,
        };
        console.log(newPost);

        const jsObjectArray = JSON.parse(data);
        jsObjectArray.push(newPost);
        const obJS = JSON.stringify(jsObjectArray);

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

        res.render("index.ejs", posts)
    });
});

/*Server connection*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});