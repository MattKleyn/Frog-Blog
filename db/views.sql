/* Table of posts info*/
CREATE TABLE posts
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title character varying(255),
    body text,
    author character varying(255),
    hero_image bytea,
    created_at date,
    featured boolean,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_title_key UNIQUE (title)
)

/*Junction table for posts and categories*/
CREATE TABLE post_categories (
post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
PRIMARY KEY (post_id, category_id)
);

/* categories master table*/
CREATE TABLE categories (
    category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name varchar(255) UNIQUE NOT NULL
);

/* Table of archived posts*/
CREATE TABLE posts_archive
(
    id uuid NOT NULL,
    title character varying(255),
    body text,
    author character varying(255),
    hero_image bytea,
    created_at date,
    featured boolean,
    CONSTRAINT posts_archive_pkey PRIMARY KEY (id)
)

/* table of archived posts categories */
CREATE TABLE post_categories_archive (
post_id UUID,
category_id UUID,
PRIMARY KEY (post_id, category_id)
);

/* Table of user profiles, displays all user info*/
CREATE TABLE user_profiles
(
    user_id uuid NOT NULL,
    email character varying(100),
    username character varying(100),
    name character varying(50),
    surname character varying(50),
    profile_pic bytea,
    user_bio text,
    status character varying(100),
    tech_stack character varying(255),
    CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_profiles_username_key UNIQUE (username),
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

/* tble of users, the table used for authenitication and loging in*/
CREATE TABLE users
(
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    username character varying(50),
    email character varying(100),
    password character varying(255),
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
)

/* convert to type UUID and convert existing values with PostrgreSQL built-in uuid function*/
ALTER TABLE users
ALTER COLUMN user_id TYPE UUID USING gen_random_uuid();

/* To set DB to auto generate UUID */
ALTER TABLE posts
ALTER COLUMN id SET DEFAULT gen_random_uuid();

/* View for posts to post_categories to categories */
CREATE VIEW posts_with_categories AS
SELECT p.id, p.title, p.body, p.author, c.category_id, c.category_name
FROM posts p
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.category_id;