import { getData, writeToDB } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId, findByTitle, findById } from "../transformation_layer/transformers.js";

/* search by id */
export const searchByIdModel = async(searchId) => {
    const jsObjectArray = await getData();
    const foundPost = findById(jsObjectArray, searchId);

    console.log("User searched for: ", foundPost);

    if (!foundPost) {
        return res.render("view_post.ejs", {id: "", title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
    };

    return {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.body,
        author: foundPost.author
    };
};

/* search by title */
export const searchByTitleModel = async(searchTerm) => {
    const jsObjectArray = await getData();
    const foundPost = findByTitle(jsObjectArray, searchTerm);

    if (!foundPost) {
        return res.render("view_post.ejs", {id: "", title: "Hi there.", body: "No post found with that title.", author: "Try searching something else"})
    };

    return {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.body,
        author: foundPost.author
    };
};

/*create post */
export const createNewPost = async(data) => {
    const jsObjectArray = await getData();
    const newId = getId();

    const newPost = {
        id: newId,
        title: data.title,
        body: data.body,
        author: data.author,
    };

    console.log("new post:", newPost);

    jsObjectArray.push(newPost);
    const obJS = JSON.stringify(jsObjectArray);

    await writeToDB(obJS);

    return newPost;
};

/* Create post form */
export const getNewPostFormModel = async() => {
    return {title: ""};
};

/*Home page*/
export const getHomePageViewModel = async() => {
    const jsObjectArray = await getData();
    const arrayLength = getArrayLength(jsObjectArray);
    const latestPost = getLatestPost(jsObjectArray) ?? {title: "", body: "", author: ""};

    return {
        title: latestPost.title,
        body: latestPost.body,
        author: latestPost.author,
        quantity: arrayLength,
        recentPosts: jsObjectArray
    };
};

