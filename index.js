import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*http requests get, post, patch, delete*/
/*ejs post and patch form to display, also how display, what button to press */
/*need to parse post/patch form and then store in json file as objects in array */
/*need to fetch data from json file, and send to ejs*/

app.delete("/delete", (req, res) => {
    console.log('got a delete request')
    /*res.render("delete_post_form.ejs") */
});

app.patch("/edit", (req, res) => {
    console.log('got a patch request')
    /*res.render("edit_post_form.ejs") */
});

/* submit article button, parse, save and return new article */
app.post("/create_post", (req, res) => {
    let tit = req.body["article_name"];
    let bod = req.body["article_body"];
    let aut = req.body["author_name"];

    console.log('got a post request');
    console.log(tit + bod + aut);
    res.render("index.ejs", {
        title: tit,
        body: bod,
        author: aut,
    }); 
});/*still need to save to json */

/* create article form get */
app.get("/new_post_form", (req, res) => {
    res.render("new_post_form.ejs")
});

/* home page get */
app.get("/", (req, res) => {
    const data = {
        title: "Is your dog a frog?",
        body: "If it ribbets instead of barks, then your dog might be a frog!",
        author: "Toadd"
    };
    res.render("index.ejs", data)
})

/*server connection */
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});