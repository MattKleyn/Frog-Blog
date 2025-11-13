**Project Title & Description**
The Dev Frog Blog is a CRUD blog platform where users can write blog posts to share their journey into tech with the world. Its a way for people to journal what they are learning, their experiences, a place to reflect and allow others to join them on the journey to self improvement. A collection of these blog posts and articles for people to create, view, reflect and contribute. Currently in phase 2 of the development process, born from a personal need to learn, journal, and reflect, this will go beyond the simple capstone project from my online coursework.

**Installation Instructions**
The following are bash commands to run from your terminal
Clone repository to store on your local computer: 
git clone https://github.com/MattKleyn/Frog-Blog.git
cd Frog-Blog

Ensure Node and NPM are installed then install dependancies from the package.json:
npm install

Run the server, currenly using port=3000 and the entry point is index.js:
node index.js

This starts the server. Then open your browser and go to http://localhost:3000. From here you can explore all existing functionalities. To shut the server down, type ctrl + c in the same terminal that is running the entrypoint.

OPTIONAL: 
The above node command compiles the code for every bash command, meaning if you make changes to the codebase, you will need to shut down and restart the server for the changes to take effect. To circumnavigate this, install and run the NPM package Nodemon. This will autorestart after any change you make.
npm install --save-dev nodemon
(to start the server) nodemon index.js


**Usage**
Currently all data is saved and accessed in posts.json. Any posts that you view, create, update, or delete will happen from here. To use the app is straightforward, to view a post, click on the 'Recent article' card. Each screen will have a 'Create Post' button, type in the data and save, the app will by default view the created post upon creation. From here you can navigate to wherever you want to go. When viewing a post, you will have the option to create, edit or delete a post, where each endpoint has a cancel button to go back to the view post screen. When deleting, there is a confirm screen that will come up and upon confirmation the post will be removed from posts.json and saved to deleted_posts.json for retrieval if necessary.There will once again be a feedback message where you can navigate to and from wherever you wish to go.

**Features**
Currently only supporting basic CRUD features. Users can create, view, update and delete posts with json data persistance. 

**Tech Stack**
Frontend: EJS, CSS, JS
Backend: JS, Node.js, Express.js

**Architecture Notes**
Folder structure:
dev-frog-blog/
| |_data-access-layers/
|   |_data_access.js
| |_databases/
|   |_deleted_posts.json
|   |_posts.json
| |_middleware-layers/
| |_public/
|   |_assets/
|   |_style/
|      |_styles.css
| |_service_access_layer/
|   |_services.js
| |_transformation_layer/
|   |_transformers.js
| |_views/
|   |_partials/
|     |_footer.ejs
|     |_header.ejs
|   |_delete_post.ejs
|   |_edit_post_form.ejs
|   |_index.ejs
|   |_new_post_form.ejs
|   |_view_post.ejs
|_gitignore   
|_index.js
|_package.json
|_README.md
|_project_brief.txt

Routing logic
- **Server Initialization**: `localhost:3000`
- **Home Page**: `/`
- **View Post (via search by title)**: `/view`
- **View Post (via sidebar click)**: `/posts/:id`
- **Create Post**
  - Display form: `/new_post_form`
  - Submit form: `/create_post`
- **Edit Post**
  - Display form: `/edit_post/:id`
  - Submit form: `/edit/:id`
- **Delete Post**
  - Display confirmation form: `/delete_form/:id`
  - Submit deletion/archive: `/delete_post/:id`


Middleware and utilities
Coming soon as part of phase 2 refactor.

**Known Issues / Limitations**
Currently there are no regressions.
Currently the search function is limited to using the entire title but is not caps sensitive. Additional filter parameters to come.
Phase 2 is a codebase refactor to keep it DRY, creating shared middleware and utilities. A clear separation of concerns also involved. The site works but now it needs to be streamlined.
Proper testing and input validation and sanitization required.

**Problems & Solutions**
Currently a WIP but will be a great place to journal and share experiences while learning in the tech section. The content will be skill and experience agnostic. A place for all to gather and hopefully gain some semblance of mentorship and guidance in this harsh job climate.

**Future Plans**
The project is split into 4 distinct phases:
    Phase 1 (complete) - Basic CRUD functionality and styling. 
    Phase 2 (in progress) - Refactoring for better separation of concerns and future scalability, including meta tag search functionality. Accessibility audit using Axe-core.
    Phase 3 (future) - Create a relational database with either MySQL or PostgreSQL, including migration from JSON. Implementation of user authentication and profiles. 
    Phase 4 (future) - Implementation of machine learning algorithms for better blog article recommendations and tracking. CI/CD automated testing and deployment.

**Contributing**
Want to contribute, do a code review or general feedback? Get in touch via my Github or LinkedIn profiles on my home page.

**License**
Currently this site is for learning and is in active development, please do not fork, or reuse without my permission. 

**Contact**
Matthew kleynhans
[Github](https://github.com/MattKleyn)
[LinkedIn](https://www.linkedin.com/in/matthew-kleynhans-00242195)