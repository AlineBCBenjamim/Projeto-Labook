export interface CreatePostInput {
    content: string,
    token: string | undefined

}

export interface CreatePostOutput {
    message: string
}