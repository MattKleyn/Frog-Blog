import fs from "fs/promises";
import path from "path";
import pg from "pg";
import env from "dotenv";

env.config();
// const postPath = path.join(process.cwd(), 'databases', 'posts.json');
// const archivePath = path.join(process.cwd(), 'databases', 'deleted_posts.json');

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

/* read DB */
export async function getData() {
    console.log("Accessing DB");
    try {
        const data = await db.query("SELECT * FROM posts;");
        // console.log(data.rows);
        return data.rows;
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", db.database);
        throw new Error("Posts database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("DB parse failed:", err);
        throw new Error("Posts database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read posts database.");
    }
};

/* read archive DB */
export async function removeFromDB(searchId) {
    try {
        const query = `DELETE FROM posts WHERE id=$1;`;
        const data = await db.query(query, [searchId]);
        console.log("deleted:", data.rows);
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", db.database);
        throw new Error("Posts database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("JSON parse failed:", err);
        throw new Error("Posts database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read posts database.");
    };
};

export async function removeFromArchive(searchId) {
    try {
        const query = `DELETE FROM posts_archive WHERE id=$1;`;
        const data = await db.query(query, [searchId]);
        console.log("deleted:", data.rows);
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", db.database);
        throw new Error("Posts database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("JSON parse failed:", err);
        throw new Error("Posts database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read posts database.");
    };
};

/* get single post */
export async function getPost(searchId) {
    console.log("Finding Post");
    try {
        const data = await db.query("SELECT * FROM posts WHERE id = $1;", [searchId]);
        console.log("Found Post:", data.rows[0]); 
        return data.rows[0]; //data.rows returns array of , so must return first object at index 0.
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", db.database);
        throw new Error("Posts database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("DB parse failed:", err);
        throw new Error("Posts database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read posts database.");
    }
};

/* get categories */
export async function getCategories() {
    try{
        const data = await db.query(`SELECT * FROM categories ORDER BY category_name;`);
        //console.log("categories[0]:", data.rows[0]);
        return data.rows;
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", db.database);
        throw new Error("Categories database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("DB parse failed:", err);
        throw new Error("Categories database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read Categories database.");
    }
};

export async function getCategoriesByIds(ids) {
  if (!ids.length) return [];
  const { rows } = await db.query(
    `SELECT category_id FROM categories WHERE category_id = ANY($1::uuid[])`,
    [ids]
  );
  return rows;
}

/* write to DB */
export async function writeToDB(data) {
    try {
        const query = `INSERT INTO posts (title, body, author, hero_image, created_at, featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const values = [
            data.title,
            data.body,
            data.author,
            data.hero_image || null,
            data.created_at || null,
            data.featured
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch(err) {
        console.error("Failed to write to file:", err);
        throw new Error("Failed to write to file");
    };
};

export async function insertPostCategories(postId, categoryIds) {
    for (const catId of categoryIds) {
        await db.query(
            `INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2)
            ON CONFLICT (post_id, category_id) DO NOTHING;`,
            [postId, catId]
        );
    }
};

/* update DB entry */
export async function updateDBEntry(userId, userInput) {
    try {
        const query = `UPDATE posts SET title = $2, body = $3, author = $4, hero_image = $5, created_at = $6, featured = $7 WHERE id = $1 RETURNING *;`;
        const values = [
            userId,
            userInput.title,
            userInput.body,
            userInput.author,
            userInput.hero_image || null,
            userInput.created_at || null,
            userInput.featured
        ];
        console.log("values:", values);
        const result = await db.query(query, values);
        return result.rows[0];
    } catch(err) {
        console.error("Failed to write to file:", err);
        throw new Error("Failed to write to file");
    };
};

/* write to archive DB */
export async function writeToArchiveDB(searchId) {
    try {
        const query = `INSERT INTO posts_archive SELECT * FROM posts WHERE id=$1 RETURNING *;`;
        const data = await db.query(query, [searchId]);
        console.log(data.rows[0]);
        return data.rows[0]
    } catch(err) {
        console.error("Failed to write to archive:", err);
        throw new Error("Failed to write to file");
    };
};

export async function copyToDB(searchId) {
    try {
        const query = `INSERT INTO posts SELECT * FROM posts_archive WHERE id=$1 RETURNING *;`;
        const data = await db.query(query, [searchId]);
        console.log(data.rows[0]);
        return data.rows[0]
    } catch(err) {
        console.error("Failed to write to archive:", err);
        throw new Error("Failed to write to file");
    };
};

export async function newUserInfo(username, userEmail, userPassword) {
    try{
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`;
        const userInfo = [username, userEmail, userPassword];
        const user = await db.query(query, userInfo);
        return user.rows[0]
    } catch(err) {
        console.error("Failed to save new user info to DB:", err);
        throw new Error("Failed to write new user to file")
    };
};

export async function newUserProfile(userId, username, userEmail) {
    try{
        const query = `INSERT INTO user_profiles (user_id, username, email) VALUES ($1, $2, $3) RETURNING *;`;
        const userInfo = [userId, username, userEmail];
        const user = await db.query(query, userInfo);
        return user.rows[0]
    } catch(err) {
        console.error("Failed to save new user info to DB:", err);
        throw new Error("Failed to write new user to file")
    };
};

export async function getPassword(userEmail) {
    try{
        console.log("email input:", userEmail);
        const query = `SELECT * FROM users WHERE email=$1;`;
        const user = await db.query(query, [userEmail]);
        console.log("user:", user.rows[0]);
        return user.rows[0]
    } catch(err) {
        console.error("Failed to get user password from DB:", err);
        throw new Error("Failed to retrieve password")
    };
};

export async function accountExists(userEmail) {
    try {
        const query = `SELECT * FROM users WHERE email=$1;`;
        const isExisting = await db.query(query, [userEmail]);
        console.log("User exists:", isExisting.rows);
        return isExisting.rows
    } catch(err) {
        console.error("Failed to retrieve from DB:", err);
        throw new Error("Failed to retrieve email from DB")
    };
};

export async function getUser(userId) {
    try {
        const query = `SELECT * FROM users WHERE user_id=$1;`;
        const user = await db.query(query, [userId]);
        console.log("fetching user profile:", user.rows);
        return user.rows
    } catch(err) {
        console.error("Failed to retrieve from DB:", err);
        throw new Error("Failed to retrieve email from DB")
    };
};

export async function getUserProfileById(userId) {
  try {
    const query = `
      SELECT user_id, username, email, name, surname, profile_pic, user_bio, status, tech_stack
      FROM user_profiles
      WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    throw new Error("Database error fetching user profile");
  }
};

export async function updateUserProfileById(userId, userInfo) {
  const query = `
    UPDATE user_profiles
    SET username = $1, email = $2, status = $3, name = $4, surname = $5, tech_stack = $6, user_bio = $7
    WHERE user_id = $8
    RETURNING *;
  `;
  const values = [
    userInfo.username, 
    userInfo.email, 
    userInfo.status, 
    userInfo.name, 
    userInfo.surname, 
    userInfo.tech_stack, 
    userInfo.user_bio, 
    userId];
  const result = await db.query(query, values);
  return result.rows[0];
};