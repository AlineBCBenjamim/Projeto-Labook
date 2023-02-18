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