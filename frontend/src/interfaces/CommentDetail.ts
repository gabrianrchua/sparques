export default interface CommentDetail {
  _id: string,
  postId: string | undefined,
  author: string,
  content: string,
  creationDate: Date,
  editDate: Date,
  parentId: string | undefined,
}