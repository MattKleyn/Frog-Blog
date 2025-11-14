import fs from "fs/promises";
import path from "path";

const postPath = path.join(process.cwd(), 'databases', 'posts.json');

/* read DB with try catch*/
export async function getData() {
    try {
        const data = await fs.readFile(postPath, 'utf-8') 
        return JSON.parse(data);
    } catch(err) {
        if (err.code === "ENOENT") {
        console.error("File not found:", postPath);
        throw new Error("Posts database file missing.");
        }
        if (err instanceof SyntaxError) {
        console.error("JSON parse failed:", err);
        throw new Error("Posts database is corrupted.");
        }
        console.error("Unexpected read error:", err);
        throw new Error("Failed to read posts database.");
    }
};

/* write to DB */
export async function writeToDB(data){
    const tmpPath = postPath + ".tmp";
    try {
        await fs.writeFile(tmpPath, data, 'utf-8');
        await fs.rename(tmpPath, postPath);
    } catch(err) {
        console.error("Failed to write to file:", err);
        throw new Error("Failed to write to file");
    }
};