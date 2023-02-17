import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { CreatePostInput, GetPostsInput } from "../dtos/postDTO"

export class PostController{
    constructor(private postBusiness: PostBusiness) {}

    public getPosts = async (req: Request, res: Response) => {
        try {
          const input: GetPostsInput ={
            q: req.query.q as string | undefined,
            token: req.headers.authorization
          }
          
          const output = await this.postBusiness.getPosts(input)

          res.status(200).send(output)
            
        } catch (error) {
            console.log(error)

      if (error instanceof Error) {
        res.status(500).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
        }
    }

    public createPost = async (req: Request, res: Response) => {
      try {

        const input: CreatePostInput = {
          content: req.body.content,
          token: req.headers.authorization
        }

        const output = await this.postBusiness.createPost(input)

        res.status(201).send(output)

      } catch (error) {
        console.log(error)

            if (error instanceof Error) {
              res.status(500).send(error.message)
            } else {
              res.status(500).send("Erro inesperado")
            }
      }
    }
    
    public updatePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const content = req.body.content;
    const token = req.headers.authorization as string;

    await this.postBusiness.updatePost(id, content, token);

    res.status(200).send({ message: "Post atualizado com sucesso!" });
  } catch (error) {
    console.log(error);

    if (error instanceof BaseError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send("Erro inesperado");
    }
  }
}
}  