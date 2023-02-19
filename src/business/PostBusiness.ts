import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInput, CreatePostOutput, DeletePostInput, EditPostInputDTO, GetPostsInput } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { USER_ROLES } from "../types"

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
  public editPost = async (input: EditPostInputDTO): Promise<void> => {
    const { idToEdit, token, content } = input

    if (token === undefined) {
      throw new BadRequestError("Token ausente!")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido!")
    }

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string")
    }

    const postDB = await this.postDatabase.findById(idToEdit)

    if (!postDB) {
      throw new NotFoundError("'id' não encontrado.")
    }

    if (postDB.creator_id !== payload.id) {
      throw new BadRequestError("somente quem criou o post pode editá-lo.")
    }

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      payload
    );

    post.setContent(content)
    post.setUpdatedAt(new Date().toISOString())

    const updatePostDatabase = post.toDBModel()

    await this.postDatabase.update(idToEdit, updatePostDatabase)
  }

  public deletePost = async (input: DeletePostInput): Promise<void> => {
    const { idToDelete, token } = input

    if (token === undefined) {
      throw new BadRequestError("Token ausente!")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido!")
    }
    
    const postDB = await this.postDatabase.findById(idToDelete)

    if (!postDB) {
      throw new NotFoundError("'id' não encontrado.")
    }

    if (payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== payload.id) {
      throw new BadRequestError("somente quem criou o post pode deletá-lo.")
    }

    await this.postDatabase.deleteById(idToDelete)
  }
}