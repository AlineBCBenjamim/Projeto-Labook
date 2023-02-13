import { Request, Response } from "express";



export class PostController{
    constructor() {}

    public getPosts = async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            console.log(error);

      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
        }
    }
}  