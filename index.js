import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import methodOverride from "method-override";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import {getHomePageViewModel, searchByTitleModel, searchByIdModel, editPostModel, deleteAndArchiveModel, undoDeleteModel, registerUserModel, authenticateUserModel, getUserProfileModel, createNewPost, updateUserProfileModel, newPostFormModel} from "./service_access_layer/services.js";
import { accountExists, getUser } from "./data-access-layers/data_access.js";
import { attachUserToLocals, ensureAuthenticated } from "./middleware-layers/validatePost.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24,
    }
}));

/* passport must be after session */
app.use(passport.initialize());
// app.use((req, res, next) => {
//   console.log("Before passport.session:", req.user);
//   next();
// });

app.use(passport.session());

// app.use((req, res, next) => {
//   console.log("After passport.session:", req.user);
//   next();
// });

app.use(attachUserToLocals);


/*undo delete route, protected with ensureAuthentication middleware */
app.delete("/undo_delete/:id", ensureAuthenticated, async(req,res) => {
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

/*delete and archive post, protected with ensureAuthentication middleware*/
app.delete("/delete_post/:id", ensureAuthenticated, async(req, res) => {
    try{
        const searchId = req.params.id;
        const postInfo = await deleteAndArchiveModel(searchId);
        res.render("delete_post.ejs", postInfo) 
    } catch(err) {
        console.error("Failed to render delete confirmation:", err);
        res.status(500).send("Could not load delete confirmation")
    };
});

/* get delete confirm form, protected with ensureAuthentication middleware */
app.get("/delete_form/:id", ensureAuthenticated, async(req, res) => {
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

/* Save edited feild, protected with ensureAuthentication middleware*/
app.patch("/edit/:id", ensureAuthenticated, async(req, res) => {
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

/* Get edit post form, protected with ensureAuthentication middleware*/
app.get("/edit_post/:id", ensureAuthenticated, async(req, res) => {
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

/*New post submission and display new post, protected with ensureAuthentication middleware*/
app.post("/create_post", ensureAuthenticated, async(req, res) => {
    try{
        const userInput = req.body;
        const user = req.user;
        console.log("new post details:", userInput);
        console.log("req.user:", user);

        const newPost = await createNewPost(userInput, user);
        console.log("new post:", newPost);

        if (newPost.errors) {
            return res.status(400).render("new_post_form.ejs", {
                categories: newPost.categories,
                errors: newPost.errors,
                form: newPost.form,
            });
        };

        res.redirect(`/posts/${newPost.post.id}`); 
    } catch(err) {
        console.error("Failed to render new post:", err);
        res.status(500).send("Could not load new post")
    };
});

/*Display create post form, protected with ensureAuthentication middleware*/
app.get("/new_post_form", ensureAuthenticated, async(req, res) => {
    try {
        console.log("Display create post form");
        const categories = await newPostFormModel();
        res.render("new_post_form.ejs", {
            categories, 
            errors: [], 
            form: {},
            user: req.user
        });   
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

        if (!userInfo) {
            return res.status(400).send("Email already exists, please log in.");
        }

        res.render("home.ejs", {user: userInfo})
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

/* logout user */
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        };
        console.log("User logged out.");
        res.redirect("/")
    })
});

/* Update user profile, protected with ensureAuthentication middleware */
app.patch("/update_profile/:id", ensureAuthenticated, async(req, res) => {
      try {
    const requestedId = req.params.id;

    if (req.user.user_id !== requestedId) {
      return res.status(403).send("Forbidden");
    }

    await updateUserProfileModel(requestedId, req.body);
    res.redirect(`/user_profile/${requestedId}`);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Could not update profile.");
  }
});

/* Get form to Edit user profile, protected with ensureAuthenticaation middleware */
app.get("/edit_profile/:id", ensureAuthenticated, async(req, res) => {
    try {
        const requestedId = req.params.id;
        console.log("userId:", requestedId);

        // Only allow editing your own profile
        if (req.user.user_id !== requestedId) {
        return res.status(403).send("Forbidden");
        };

        const userProfile = await getUserProfileModel(requestedId);
        res.render("edit_profile_form.ejs", {user: userProfile})
    } catch (err) {
        console.error("Failed to render requested profile:", err);
        res.status(500).send("Could not load profile")
    }
});

/* view user profile, protected with ensureAuthentication middleware */
app.get("/user_profile/:id", ensureAuthenticated, async(req, res) => {
    try {
       console.log(req.user);
        const requestedId = String(req.params.id).trim();
        const currentUserId = String(req.user?.user_id || "").trim();
        console.log("req.user", req.user);

        if (currentUserId !== requestedId) {
            return res.status(403).send("Forbidden");
        } 

        const userProfile = await getUserProfileModel(requestedId);
        console.log("userProfile:", userProfile);
        res.render("profile_user.ejs", {user: userProfile}); 
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).send("Could not render user profile.");
    };
});

/* login user with passport session to get req.user object for authentication */
app.post("/login_user", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        console.log("authenticating user");
        if (err) return next(err);
        if (!user) return res.render("home.ejs", { error: info?.message || "Login failed" });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect(`/user_profile/${user.user_id}`);
        });
    })(req, res, next);
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

/* Email and password login Strategy */
passport.use(
    new Strategy(
        { usernameField: "email" },
        async function verify(email, password, cb) {
        try{
            const usersArray = await accountExists(email);
            const user = usersArray[0];
            if (usersArray.length === 0) {
                return cb(null, false, { message: "User not found" });
            }

            const storedHashedPassword = user.password;
            const valid = await bcrypt.compare(password, storedHashedPassword);
            if (valid) {
                return cb(null, user)
            } else {
                return cb(null, false, { message: "Incorrect password" })
            }
        } catch(err) {
            console.log(err);
            return cb(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user.user_id)
});

passport.deserializeUser(async (id, cb) => {
    try {
        const result = await getUser(id);
        cb(null, result[0]);
    } catch (err) {
        cb(err);
    }
});

/*Server connection*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});