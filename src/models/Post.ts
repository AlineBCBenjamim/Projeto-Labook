import { PostDB, PostModel } from "../types";

export class Post {
  constructor(
    private id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private creator: {
      id: string;
      name: string;
    }
  ) {}

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creator.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: {
        id: this.creator.id,
        name: this.creator.name,
      },
    };
  }
}