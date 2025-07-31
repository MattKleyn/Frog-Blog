/* experiments */
const posts = [
    {article_name: "yippjie", article_body: "curvy", author_name: "mayy"}, 
    {title: "Is your dog a frog?", body: "If it ribbets instead of barks, then your dog might be a frog!", author: "Toadd"},
    {title: "Is your Bog a Mog?", body: "If it's a purple Tuesday, then your Bog might be a Mog!", author: "Bojack"}
];
/*
console.log("global1:", posts[0]);
console.log("global2:", posts[1]);
console.log("global3:", posts[1].title); all 3 indexing methods work, so potentially use to filter search*/



/*
const obj = {name: "jackson", username: "cheeckychipmunks", color: "blue"};
const myJSON = JSON.stringify(obj);  
const myJS = JSON.parse(myJSON);

console.log(obj.name);
console.log(myJSON.color);cant access JSON data directly, must turn into JS object first using .parse
console.log(myJS.username);

fs.readFile("./data/posts.json", "utf-8", (err, data) => {
    if (err) throw (err);
    console.log(data)/*the data is the contents of the file to can use this to get and send to ejs 
})
*/

/* 
custom middleware notation
function myMiddleware(req, res, next) {
    do_somthing;
    next();
}

to use middleware 
app.use(myMiddleware); 
*/

function saveAsJSON (req, res, next) {
    const obJS = JSON.stringify(req.body);
    console.log("JS object stringify: ", obJS);

    fs.writeFile("./data/posts.json", obJS, (err) => { 
        if (err) throw (err);
        console.log("posts.json updated")
    });    
    next();
}

app.use(saveAsJSON); 

