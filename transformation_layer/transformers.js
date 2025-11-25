
export const getArrayLength = (posts) => {
    return Array.isArray(posts) ? posts.length : 0
}; //Array.isArray to validate data type is array and not other

export const getLatestPost = (posts) => {
    if (!Array.isArray(posts) || posts.length === 0) return null;
    // console.log("is array:", Array.isArray(posts));
    return posts[posts.length - 1]
};

export const getId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000)
}; //set DB to generate UUID

export const findByTitle = (posts, searchTerm) => { 
    return posts.find(post => post.title.toLowerCase() === searchTerm);
};

export const findById = (posts, searchId) => {
    return posts.find(post => post.id === searchId);
};

export const findByIndex = (posts, searchId) => {
    return posts.findIndex(post => post.id === searchId);
};

export const removeFromArray = (posts, postIndex) => {
    return posts.splice(postIndex,1);
}