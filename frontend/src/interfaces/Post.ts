export default interface Post {
  _id: string,
  title: string,
  content: string,
  author: string,
  community: string,
  creationDate: Date,
  editDate: Date
}