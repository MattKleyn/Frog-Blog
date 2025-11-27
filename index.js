import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import methodOverride from "method-override";
import {getHomePageViewModel, getNewPostFormModel, createNewPost, searchByTitleModel, searchByIdModel, editPostModel, deleteAndArchiveModel, undoDeleteModel, registerUserModel, authenticateUserModel } from "./service_access_layer/services.js";

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

/* Post register */
app.post("/register_user", async(req, res) => {
    try{
        const newUser = req.body;
        const userInfo = await registerUserModel(newUser);
        res.render("home.ejs", userInfo)
    } catch(err) {
        console.error("Failed to register new user:", err);
        res.status(500).send("Failed to submit user registration, please try again later.")
    }
});

/* Display registration screen */
app.get("/register_form", async(req, res) => {
    try{
        res.render("register.ejs");
    } catch(err) {
        console.error("Failed to load registration screen:", err);
        res.status(500).send("Something went wrong on our side, please try again later.")
    };
});

/* Post login *///in ejs render make user details visible, also pop up modal to say "hi <username>". need to return username from db. also I dont like this passing around of the password. Also there is no logout button and obviously no salting or hashing, oauthnon yet.
//no link between user login and user profile, still need to do user profil get, post and patch.
//still need to validate user for create/ edit/ delete posts
app.post("/login_user", async(req, res) => {
    try{
        const userInput = req.body;

        const isAuthenticated = await authenticateUserModel(userInput);
        console.log("authenticated:", isAuthenticated);
        if (isAuthenticated) {
            const posts = await getHomePageViewModel();
            res.render("index.ejs", posts)
        } else {
            res.send("Incorrect password, please try again.")
        };
    } catch(err) {
        console.error("Failed to login user:", err);
        res.status(500).send("Failed to login, please try again later.")
    };
});

/* Display login screen */
app.get("/login_form", async(req,res) => {
    try{
        res.render("home.ejs");
    } catch(err) {
        console.error("Failed to load login screen:", err);
        res.status(500).send("Something went wrong on our side, please try again later.")
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