import { getData, getPost, removeFromDB, removeFromArchive, updateDBEntry, writeToArchiveDB, writeToDB, copyToDB, newUserInfo, getPassword } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId, findByTitle, findById, findByIndex, removeFromArray } from "../transformation_layer/transformers.js";

/* user login */
export const authenticateUserModel = async(userEmail) => {
    const userpassword = await getPassword(userEmail);
    console.log("serv pword", userpassword.password);
    return userpassword.password
};

/* Register new user model */
export const registerUserModel = async(newUser) => {
    const username = newUser.username;
    const userEmail = newUser.email;
    const userPassword = newUser.password;
    const userId = Math.floor(Math.random()*100);

    const userInfo = await newUserInfo(userId, username, userEmail, userPassword);
    return {
        id: userInfo.id,
        username: userInfo.username,
    };
};

/* undo delete */
export const undoDeleteModel = async(searchId) => { 
    const foundPost = await copyToDB(searchId);
    await removeFromArchive(searchId);

    return {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.body,
        author: foundPost.author
    };
};

/* delete post and archive model */
export const deleteAndArchiveModel = async(searchId) => {
    const archiveObject = await writeToArchiveDB(searchId);
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

