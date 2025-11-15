import { getArchiveData, getData, writeToArchiveDB, writeToDB } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId, findByTitle, findById, findByIndex, removeFromArray } from "../transformation_layer/transformers.js";

/* delete post and archive model */
export const deleteAndArchiveModel = async(searchId) => {
    
    const jsObjectArray = await getData();
    const foundPost = findById(jsObjectArray, searchId);
    const postIndex = findByIndex(jsObjectArray, searchId);

    console.log("deleting object:", foundPost);
    console.log("deleting at index:", postIndex);

    if (!foundPost) {
        return res.render("view_post.ejs", {title: "Hi there.", body: "No post found with that id.", author: "Please try again"})
    };

    if (postIndex === -1) {
        return res.status(404).send("Post not found")
    };

    /*setTimeout(10000, deleteAndArive) => deleteAndArchive(if (cancel = false) {delete and write} else {break})*/
        
    /*console.log("before: ",jsObjectArray);*/
    removeFromArray(jsObjectArray, postIndex);
    /*console.log("after: ",jsObjectArray);*/
    const updatedArray = JSON.stringify(jsObjectArray);

    await writeToDB(updatedArray);
    
    const archiveObject = await getArchiveData();
    archiveObject.push(foundPost);
    const archive = JSON.stringify(archiveObject);

    await writeToArchiveDB(archive);

    return {title: ""}; 
};

/* edit post submit */
export const editPostModel = async(searchId, userInput) => {
    const jsObjectArray = await getData();

    const postIndex = findByIndex(jsObjectArray, searchId);
    console.log("post index:", postIndex);

    if (postIndex === -1) {
        return res.status(404).send("Post not found")
    };

    /*update fields*/
    console.log("before update:", jsObjectArray[postIndex]);
    jsObjectArray[postIndex] = {
        ...jsObjectArray[postIndex],
        title: userInput.title,
        body: userInput.body,
        author: userInput.author
    };

    console.log("after update:", jsObjectArray[postIndex]);
    const obJS = JSON.stringify(jsObjectArray);

    await writeToDB(obJS);

    return jsObjectArray[postIndex].id;
};

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

/* create new post */
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

