import getData from "../data-access-layers/data_access.js";
import { getArrayLength, getLatestPost } from "../transformation_layer/transformers.js";


/*Home page*/
const getHomePageViewModel = async() => {
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

export default getHomePageViewModel;