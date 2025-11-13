import { getData, writeToDB } from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost, getId, findByTitle } from "../transformation_layer/transformers.js";

export const searchByTitleModel = async(data) => {
            const jsObjectArray = await getData();
            const foundPost = findByTitle(jsObjectArray, data);
    
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

