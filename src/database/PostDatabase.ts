import { PostDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { UserDataBase } from "./UserDatabase"

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public getAllPosts = async () => {
        const postsDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
        return postsDB    
    }

    public getPostsAndUsers = async (q: string | undefined) => {

        let postsDB: PostDB[]

       
        postsDB = await this.getAllPosts()
       
        const usersDB = await BaseDatabase
        .connection(UserDataBase.TABLE_USERS)
        .select()
        
        return {
            postsDB,
            usersDB
        }
    }

    public createPost = async (post: PostDB): Promise<void> => {
        await BaseDatabase  
            .connection(PostDatabase.TABLE_POSTS)
            .insert(post)
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({ id })

        return result[0]
    }

    public update = async (
        id: string,
        postDB: PostDB
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id })
    }

    public deleteById = async (id: string): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id })
    }
}