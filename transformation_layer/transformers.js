import bcrypt from "bcrypt";

const saltRounds = 10;

export const transformUserProfile = async(profileRow) => {
  return {
    id: profileRow.user_id,
    username: profileRow.username,
    email: profileRow.email,
    name: profileRow.name || "",
    surname: profileRow.surname || "",
    status: profileRow.status || "",
    user_bio: profileRow.user_bio || "",
    tech_stack: profileRow.tech_stack || "",
  };
}

export const userAuthentication = async(userPassword, storedHashedPassword) => {
    try{
        const result = await bcrypt.compare(userPassword, storedHashedPassword);
        console.log("result:", result);
        return result
    } catch(err) {
        console.log("Error comparing passwords:", err)
    };
};

export const passwordHash = async(password) => {
    try{
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("local:", hash);
        return hash
    } catch(err) {
        console.log("Error hashing password:", err)
    }
};

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