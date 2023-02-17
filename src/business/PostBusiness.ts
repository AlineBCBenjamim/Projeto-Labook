import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInput, CreatePostOutput, GetPostsInput } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class PostBusiness {
  constructor(private postDatabase: PostDatabase,
              private idGenerator: IdGenerator,
              private tokenManager: TokenManager) {}

  public getPosts = async (input: GetPostsInput) => {
    const {q, token} = input

    if(!token){
      throw new BadRequestError("Token não enviado!")
    }

    const payload = this.tokenManager.getPayload(token as string)

    if(payload === null){
      throw new BadRequestError("Token inválido!")
    }

    if(typeof q !== "string" && q !== undefined){
      throw new BadRequestError("'q' deve ser string ou undefined")
    }

    const { postsDB, usersDB } = await this.postDatabase.getPostsAndUsers(q)

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

    function getCreator(creatorId: string) {
      const creator = usersDB.find((userDB) => {
        return userDB.id === creatorId
      })

      return {
        id: creator.id,
        name: creator.name,
      }
    }
    return posts
  }

  public createPost = async (
    input: CreatePostInput
  ): Promise<CreatePostOutput> => {
    const { content, token } = input
    const payload = this.tokenManager.getPayload(token as string)

    if (payload === null) {
      throw new BadRequestError("Usuário não logado")
    }

    if (typeof content !== "string") {
      throw new BadRequestError("Post deve ser uma string!")
    }

    if (content.length === 0) {
      throw new BadRequestError("Post não pode ser vazio!")
    }

    const id = this.idGenerator.generate()

    const newPost = new Post(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload
    )

    const postDB = newPost.toDBModel()

    await this.postDatabase.createPost(postDB)

    const output: CreatePostOutput = {
      message: "Post enviado com sucesso!",
    }

    return output
  }
  public editPost = async (postId: string, newContent: string, token: string) => {
  const payload = this.tokenManager.getPayload(token);

  if (payload === null) {
    throw new BadRequestError("Usuário não logado!");
  }

  const post = await this.postDatabase.getPostById(postId);

  if (!post) {
    throw new BadRequestError("Post não encontrado!");
  }

  if (post.creator_id !== payload.id && payload.role !== USER_ROLES.ADMIN) {
    throw new ForbiddenError("Usuário não autorizado!");
  }

  post.content = newContent;
  post.updated_at = new Date().toISOString();

  await this.postDatabase.updatePost(post);

  const editedPost = new Post(
    post.id,
    post.content,
    post.likes,
    post.dislikes,
    post.created_at,
    post.updated_at,
    {
      id: post.creator_id,
      name: post.creator_name
    }
  );

  return editedPost.toBusinessModel();
}

}