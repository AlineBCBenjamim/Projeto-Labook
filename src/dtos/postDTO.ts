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