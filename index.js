import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import methodOverride from "method-override";
import {getHomePageViewModel, getNewPostFormModel, createNewPost, searchByTitleModel, searchByIdModel, editPostModel, deleteAndArchiveModel, undoDeleteModel } from "./service_access_layer/services.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

/*undo delete route */
app.delete("/undo_delete/:id", async(req,res) => {
    try{
        const searchId = req.params.id;
        console.log("trying to undo", searchId);
        const postInfo = await undoDeleteModel(searchId);
        res.render("view_post.ejs", postInfo)
    } catch(err){
        console.error("Failed to undo delete:", err);
        res.status(500).send("Could not undo delete...oops.")
    };
});

/*delete and archive post.*/
app.delete("/delete_post/:id", async(req, res) => {
    try{
        const searchId = req.params.id;
        const postInfo = await deleteAndArchiveModel(searchId);
        res.render("delete_post.ejs", postInfo) 
    } catch(err) {
        console.error("Failed to render delete confirmation:", err);
        res.status(500).send("Could not load delete confirmation")
    };
});

/* get delete confirm form */
app.get("/delete_form/:id", async(req, res) => {
    try{
        console.log("Delete request for ID:", req.params.id);
        const searchId = req.params.id;
        const postInfo = await searchByIdModel(searchId);
        res.render("delete_post.ejs", postInfo);
    } catch(err) {
        console.error("Failed to render requested post:", err);
        res.status(500).send("Could not load post")
    };
});

/* Save, and display edited post page. This is what we are working on CoPilot, can you read this btw?*/
app.patch("/edit/:id", async(req, res) => {
    try{
        const searchId = req.params.id;
        const userInput = req.body;
        console.log('Editing post with ID:', searchId);
        const postInfo = await editPostModel(searchId, userInput);
        res.redirect(`/posts/${postInfo}`);
    } catch(err) {
        console.error("Failed to render requested post:", err);
        res.status(500).send("Could not load post")
    };
});

/* Get edit post form*/
app.get("/edit_post/:id", async(req, res) => {
    try{
        console.log('Edit request for ID:', req.params.id);
        const searchId = req.params.id;
        const postInfo = await searchByIdModel(searchId);
        res.render("edit_post_form.ejs", postInfo)         
    } catch(err) {
        console.error("Failed to render requested post:", err);
        res.status(500).send("Could not load post")
    };

});

/* view article by homepage link, use article unique id */
app.get("/posts/:id", async(req, res) => {
    try{
        console.log("User searched for id:", req.params.id);      
        const searchId = req.params.id;
        const postInfo = await searchByIdModel(searchId);
        res.render("view_post.ejs", postInfo);
    } catch(err) {
        console.error("Failed to render requested post:", err);
        res.status(500).send("Could not load post")
    };
});

/* Search bar, article by title, using Post req instead of get request, doesnt give valid form data, returns undefined*/
app.post("/view", async(req, res) => {
    try{
        const searchTerm = req.body.search.toLowerCase();
        const postInfo = await searchByTitleModel(searchTerm);
        res.render("view_post.ejs", postInfo)
    } catch(err) {
        console.error("Failed to render requested post:", err);
        res.status(500).send("Could not load post")
    };
});

/*New post submission. Save, and display new post.*/
app.post("/create_post", async(req, res) => {
    try{
        const userInput = req.body;
        const newPost = await createNewPost(userInput);
        res.render("view_post.ejs", newPost); 
    } catch(err) {
        console.error("Failed to render new post:", err);
        res.status(500).send("Could not load new post")
        /*need to include failed to write err */
    };
});

/*Display create post form*/
app.get("/new_post_form", async(req, res) => {
    try {
        console.log("Display create post form");
        const posts = await getNewPostFormModel();
        res.render("new_post_form.ejs", posts);   
    } catch (err) {
        console.error("Failed to render new post form:", err);
        res.status(500).send("Could not load new post form")
    };
});

/*Display Home page*/
app.get("/", async (req, res) => {
    try{
        console.log("Display homepage");
        const posts = await getHomePageViewModel();
        res.render("index.ejs", posts);
    } catch(err) {
        console.error("Failed to load posts:", err);
        res.status(500).send("Could not load posts")
    };
});

/*Server connection*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});