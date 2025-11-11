import fs from "fs/promises";
import path from "path";

const postPath = path.join(process.cwd(), 'databases', 'posts.json');

/* read DB */
async function getData() {
    const data = await fs.readFile(postPath, 'utf-8'); //returns string
    return JSON.parse(data);
};

/* write to DB */

export default getData;