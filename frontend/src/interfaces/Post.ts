import CommentDetail from "./CommentDetail";
import Vote from "./Vote";

export default interface Post {
  _id: string,
  title: string,
  content: string,
  author: string,
  community: string,
  creationDate: Date,
  editDate: Date,
  numComments: number,
  numUpvotes: number,
  numDownvotes: number,
  comments: CommentDetail[] | undefined,
  votes: Vote[] | undefined,
}