import { PostDatabase} from "../database/PostDatabase";
import { Post } from "../models/Post";


export class PostBusiness {
    constructor(private postDatabase: PostDatabase){}

    public getPosts = async (q: string | undefined) => {
        const {postsDB, usersDB} = await this.postDatabase.getPostsAndUsers(q);
    
        const posts = postsDB.map((postDB) => {
        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            getCreator(postDB.creator_id)
        )
        return post.toBusinessModel()    
    })

    function getCreator(creatorId: string){
        const creator = usersDB.find((userDB) => {
            return userDB.id === creatorId
        })

        return{
            id:creator.id,
            name: creator.name,
        }
    }
    return posts
    }    
}