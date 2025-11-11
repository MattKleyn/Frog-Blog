
export const getArrayLength = (posts) => {
    return Array.isArray(posts) ? posts.length : 0
}; //Array.isArray to validate data type is array and not other

export const getLatestPost = (posts) => {
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts[posts.length - 1]
};
