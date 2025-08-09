import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

/* HTTP request routing */
/*delete and archive post.*/
app.delete("/delete_post/:id", (req, res) => {
    console.log("Starting deletion:", req.params.id);

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const foundPost = jsObjectArray.find(post => post.id === req.params.id);
        const postIndex = jsObjectArray.findIndex(post => post.id === req.params.id);

        console.log("deleting object:", foundPost);
        console.log("deleting at index:", postIndex);

        if (!foundPost) {
            return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
        };

        if (postIndex === -1) {
            return res.status(404).send("Post not found")
        };

        /*if not cancel and 10s elapses then remove post and archive, else break*/
        console.log("before: ",jsObjectArray);
        jsObjectArray.splice(postIndex,1);
        console.log("after: ",jsObjectArray);
        const updatedArray = JSON.stringify(jsObjectArray);

        fs.writeFile("./data/posts.json", updatedArray, (err) => { 
            if (err) throw (err);
            console.log("posts.json updated")
        });
        
        fs.readFile("./data/deleted_posts.json", "utf-8", (err, ddata) => {
            if (err) throw (err);
            console.log("archiving: ", foundPost);
            const archiveObject = JSON.parse(ddata);
            archiveObject.push(foundPost);
            const archive = JSON.stringify(archiveObject);

            fs.writeFile("./data/deleted_posts.json", archive, (err) => { 
                if (err) throw (err);
                console.log("archive updated")
            });
        });

        res.render("delete_post.ejs", req.params)  
    });
});

/* get delete confirm form */
app.get("/delete_form/:id", (req, res) => {
    console.log("Delete request for ID:", req.params.id);

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const foundPost = jsObjectArray.find(post => post.id === req.params.id);
        console.log("delete request:", foundPost);

        if (!foundPost) {
            return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
        };

        const postInfo = {
            id: foundPost.id,
            title: foundPost.title,
            body: foundPost.body,
            author: foundPost.author
        };

        res.render("delete_post.ejs", postInfo)  
    })
});

/* Save, and display edited post page. This is what we are working on CoPilot, can you read this btw?*/
app.patch("/edit/:id", (req, res) => {
    const postID = req.params.id;
    console.log('Editing post with ID:', postID);
    
    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) return res.status(500).send("File read error");

        let jsObjectArray;
        try {
            jsObjectArray = JSON.parse(data);
        } catch (parseErr) {
            console.error("JSON parse failed:", parseErr);
            return res.status(500).send("Data corrupted. Please restore posts.json.");
        };

        const postIndex = jsObjectArray.findIndex(post => post.id === postID);
        console.log("post index:", postIndex);

        if (postIndex === -1) {
            return res.status(404).send("Post not found")
        };

        /*update fields*/
        console.log("before update:", jsObjectArray[postIndex]);
        jsObjectArray[postIndex] = {
            ...jsObjectArray[postIndex],
            title: req.body.title,
            body: req.body.body,
            author: req.body.author
        };

        console.log("after update:", jsObjectArray[postIndex]);
        const obJS = JSON.stringify(jsObjectArray);

        fs.writeFile("./data/posts.json", obJS, (err) => { 
            if (err) {
                console.error("Failed to write file:", err);
                return res.status(500).send("Internal Server Error");
            };

            console.log("posts.json updated");
            res.redirect(`/posts/${postID}`);
        });
    });
});

/* Get edit post form*/
app.get("/edit_post/:id", (req, res) => {
    
    console.log('Edit request for ID:', req.params.id);

    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
        if (err) throw (err);
        const jsObjectArray = JSON.parse(data);
        const foundPost = jsObjectArray.find(post => post.id === req.params.id);

        console.log("Article for editing: ", foundPost);

        if (!foundPost) {
            return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
        };

        const postInfo = {
            id: foundPost.id,
            title: foundPost.title,
            body: foundPost.body,
            author: foundPost.author
        };    
        
        res.render("edit_post_form.ejs", postInfo)
    })    
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
            id: foundPost.id,
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

       res.render("view_post.ejs", newPost); 
    });
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