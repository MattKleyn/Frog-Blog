import { getData, getPost, removeFromDB, updateDBEntry, writeToArchiveDB, writeToDB } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId, findByTitle, findById, findByIndex, removeFromArray } from "../transformation_layer/transformers.js";

/* delete post and archive model */
export const deleteAndArchiveModel = async(searchId) => {
        
    const archiveObject = await writeToArchiveDB(searchId);
    // /*setTimeout(10000, deleteAndArive) => deleteAndArchive(if (cancel = false) {delete and write} else {break})*/
    await removeFromDB(searchId);

    return {
        id: archiveObject.id,
        // title: archiveObject.title
    }; 
};

/* edit post submit */
export const editPostModel = async(searchId, userInput) => {
    const updatedEntry = await updateDBEntry(searchId, userInput);
    return updatedEntry.id;
};

/* search by id */
export const searchByIdModel = async(searchId) => {
    const foundPost = await getPost(searchId);

    console.log("User searched for: ", foundPost.title);

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

/* create new post */
export const createNewPost = async(data) => {
    const jsObjectArray = await getData();

    const newPost = {
        title: data.title,
        body: data.body,
        author: data.author,
        hero_image: "",
        created_at: "",
        featured: false,
    };

    console.log("new post:", newPost);
    const savedPost = await writeToDB(newPost);

    return savedPost;
};

/* Create post form view*/
export const getNewPostFormModel = async() => {
    return {title: ""};
};

/* Home page view*/
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

