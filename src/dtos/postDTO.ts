import { Interface } from "readline"

export interface CreatePostInput {
    content: string,
    token: string | undefined
}

export interface CreatePostOutput {
    message: string
}

export interface GetPostsInput{
    q: unknown,
    token: string | undefined
}
export interface EditPostInputDTO {
    idToEdit: string,
    content: string | undefined,
    token: string | undefined
}

export interface DeletePostInput {
    idToDelete: string,
    token: string | undefined
}
export interface LikeOrDislikePostInput {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: number
}