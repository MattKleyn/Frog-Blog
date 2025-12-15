import { getData, getPost, removePostFromDB, removeCategoriesFromDB, removeCategoriesFromArchive, removePostFromArchive, updateDBEntry, writePostToArchive, writeCategoriesToArchive, writeToDB, copyPostFromArchive, copyCategoriesFromArchive, newUserInfo, getPassword, accountExists, newUserProfile, getUserProfileById, updateUserProfileById, getCategories, insertPostCategories, getCategoriesByIds, getPostWithCategories, getPostByNameWithCategories, getPostByIdWithCategories, updatePostCategories } from "../data-access-layers/data_access.js";
import { validatePostInput } from "../middleware-layers/validatePost.js";
import { getArrayLength, getLatestPost, getId, findByTitle, findById, findByIndex, removeFromArray, passwordHash, userAuthentication, transformUserProfile, toPostInsertModel, normalizePostsWithCategories, truncateBodyText } from "../transformation_layer/transformers.js";

export async function updateUserProfileModel(userId, userInfo) {
  return await updateUserProfileById(userId, userInfo);
};

export const getUserProfileModel = async(userId) => {
  const profile = await getUserProfileById(userId);
  if (!profile) {
    throw new Error("Profile not found");
  };

  const transformedProfile = await transformUserProfile(profile);
  console.log("updated profile:", transformUserProfile);
  return transformedProfile;
};

//need a back button on incorret password or something
/* user login */
export const authenticateUserModel = async(userInput) => {
    const userEmail = userInput.email;
    const userPassword = userInput.password;

    const storedUserInfo = await getPassword(userEmail);
    console.log("storedinfo:", storedUserInfo.password.length);
    if (storedUserInfo.password.length > 0) {
        const storedHashedPassword = storedUserInfo.password;
        console.log("serv pword:", storedUserInfo.password);
        console.log("userPass:", userPassword);
        return await userAuthentication(userPassword, storedHashedPassword);
    } else {
        console.log("Incorrect Password")
    };
};

/* Register new user model *///need confirm modal of successful registration
export const registerUserModel = async(newUser) => {
    const { username, email, password } = newUser;
    
    const isRegistered = await accountExists(email);
    console.log("isreggie:", isRegistered.length);

    if (isRegistered.length > 0 ) {
        console.log("Email already exists, please try logging in.");
        return null
    };

    const hashedPassword = await passwordHash(password);
    const registeredUserInfo = await newUserInfo(username, email, hashedPassword);
    const userProfile = await newUserProfile(registeredUserInfo.user_id, registeredUserInfo.username, registeredUserInfo.email);
    console.log("userProfile:", userProfile);
    console.log("registeredUser:", registeredUserInfo);

    return {
        id: registeredUserInfo.id,
        username: registeredUserInfo.username,
        email: registeredUserInfo.email,
    };
};

/* undo delete */
export const undoDeleteModel = async(searchId) => { 
  const restoredPost = await copyPostFromArchive(searchId);
  const restoredCategories = await copyCategoriesFromArchive(searchId);

  await removePostFromArchive(searchId);
  await removeCategoriesFromArchive(searchId);

  return {
    id: restoredPost.id,
    title: restoredPost.title,
    body: restoredPost.body,
    author: restoredPost.author,
    categories: restoredCategories.categories || []
  };
};

/* delete post and archive model */
export const deleteAndArchiveModel = async(searchId) => {
  const archiveObject = await writePostToArchive(searchId);
  await writeCategoriesToArchive(searchId);

  await removePostFromDB(searchId);
  await removeCategoriesFromDB(searchId);

  return { id: archiveObject.id };
};

/* edit post submit */
export const editPostModel = async(searchId, userInput) => {
    const updatedEntry = await updateDBEntry(searchId, userInput);

    let categoryIds = [];
    if (userInput.category) {
        categoryIds = Array.isArray(userInput.category)
        ? userInput.category
        : [userInput.category];

    await updatePostCategories(searchId, categoryIds);
    }

    return updatedEntry.id;
};

/* search by id */
export const searchByIdModel = async(searchId) => {
    const rows = await getPostByIdWithCategories(searchId);
    const post = normalizePostsWithCategories(rows);
    console.log("post:", post);
    const foundPost = post[0];
    console.log("User searched for: ", foundPost.title);

    if (!foundPost) {
        return {id: "", title: "Hi there.", body: "No post found with that id.", author: "Please try again", categories: []};
    };

    return {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.body,
        author: foundPost.author,
        categories: foundPost.categories
    };
};

/* search by title */
export const searchByTitleModel = async(searchTerm) => {
    const rows = await getPostByNameWithCategories(searchTerm);

    const post = normalizePostsWithCategories(rows);
    const foundPost = post[0];
    console.log("post:", post);
    console.log("foundPost:", foundPost);

    if (!foundPost) {
        return {id: "", title: "Hi there.", body: "No post found with that title.", author: "Try searching something else", categories: []};
    };

    return {
        id: foundPost.id,
        title: foundPost.title,
        body: foundPost.body,
        author: foundPost.author,
        categories: foundPost.categories
    };
};

/* create new post */
export const createNewPost = async(formData, user) => {
    console.log("checked categories:", formData.category );
    const categories = await getCategories();

    const { errors, normalized } = await validatePostInput(formData, categories);
    if (errors.length) {
        return { errors, form: normalized, categories }
    };
    
    const postInput = toPostInsertModel(normalized, user);
   
    const savedPost = await writeToDB(postInput);
    console.log("savedPost:",savedPost);

    if (normalized.categories.length){
        await insertPostCategories(savedPost.id, normalized.categories);
    }
    return { post: savedPost};
};

/*model to display list of categories for new post */
export const newPostFormModel = async() =>  {
    const categories = await getCategories();
    return categories
};

/* Home page view*/
export const getHomePageViewModel = async() => {
    const rows = await getPostWithCategories();
    const posts = await normalizePostsWithCategories(rows);
    const arrayLength = getArrayLength(posts);
    const latestPost = getLatestPost(posts) ?? {title: "", body: "", author: "", categories: []};

    const recentPosts = posts.map( p => ({
        ...p, 
        body: truncateBodyText(p.body)
    }));

    return {
        title: latestPost.title,
        body: latestPost.body,
        author: latestPost.author,
        categories: latestPost.categories,
        quantity: arrayLength,
        recentPosts
    };
};

