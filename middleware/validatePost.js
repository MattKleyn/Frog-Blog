/* experiments */
/* 
custom middleware notation
function myMiddleware(req, res, next) {
    do_somthing;
    next();
}

to use middleware 
app.use(myMiddleware); 
*/

const posts = [
    {title: "yippjie", body: "curvy", author: "mayy"}, 
    {title: "Is your dog a frog?", body: "If it ribbets instead of barks, then your dog might be a frog!", author: "Toadd"},
    {title: "Is your Bog a Mog?", body: "If it's a purple Tuesday, then your Bog might be a Mog!", author: "Bojack"}
];

/*
const myJSON = JSON.stringify(posts);  JS object to string object literal
const myJS = JSON.parse(myJSON);       JSON string object literal to JS object 

console.log(posts[0]);   must provide index of array to access property, if one item in array then can access property directly (posts.title)
console.log(posts[1].title);
console.log(myJSON[2].title);cant access JSON data directly, must turn into JS object first using .parse
console.log(myJS.[0].title);
*/