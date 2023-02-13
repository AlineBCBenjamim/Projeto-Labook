import express from "express";
import { PostController } from "../controller/PostController";

export const postsRouter = express.Router();

const postController = new PostController()

postsRouter.get("/", postController.getPosts)