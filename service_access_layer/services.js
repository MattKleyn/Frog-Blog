import { getData, writeToDB } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId } from "../transformation_layer/transformers.js";

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

