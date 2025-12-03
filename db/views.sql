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
        REFERENCES public.users (user_id) MATCH SIMPLE
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

/* example of view, not yet done*/
CREATE VIEW vw_users_with_profiles AS
SELECT u.user_id, u.username, u.email, p.name, p.surname, p.profile_pic, p.user_bio, p.status, p.tech_stack
FROM users u
LEFT JOIN user_profiles p
WHERE u.user_id = p.user_id;