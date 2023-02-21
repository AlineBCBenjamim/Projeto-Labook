-- Active: 1676314790691@@127.0.0.1@3306

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT(DATETIME()) 
    );

    INSERT INTO users(id, name, email, password, role)
    VALUES
    ("u001", "Bárbara", "barbara@labenu.com", "$2a$12$8WLdrhlnpIweDAw0zWyOv.RjA6l3Mo.w9qdFwMT9CtJmZwW1H.DnG", "author"),
    ("u002", "Naomy", "naomy@labenu.com", "$2a$12$0vVI3.ZIzcUb3qbZfVmHE.sOd1saP.bjdbBV6SZx8IakMFsV2V.Wq ", "author"),
    ("u003", "Paulinha", "paulinha@labenu.com", "$2a$12$x/A/vB7ivYH23fN8z/RnzOVcb9FQP0g0qiACpviQyPhUkqvKTuh.m", "admin"),
    ("u004", "Filipe", "filipe@labenu.com", "$2a$12$VzjPQR8Wr7mbpnWNFCHy9uWapPZCP7dMChz5wL502JS/PLCDgV/eW", "author");

    SELECT * FROM users;

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0),
    dislikes INTEGER DEFAULT(0),
    created_at TEXT DEFAULT(DATETIME()),
    updated_at TEXT DEFAULT(DATETIME()),
    FOREIGN KEY (creator_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


INSERT INTO posts(id, creator_id, content)
VALUES
("p001", "u004", "Hello!"),
("p002", "u003", "Good Morning!"),
("p003", "u001", "What's your name?"),
("p004", "u002", "Bye!");

SELECT * FROM posts;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,    
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    UNIQUE (user_id, post_id)
);

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
("u002", "p002", 1),
("u003", "p001", 1),
("u004", "p001", 1),
("u001", "p003", 1);

SELECT * FROM likes_dislikes;