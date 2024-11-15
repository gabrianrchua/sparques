import Post from "../../interfaces/Post";
import FeedPost from "./feedpost/FeedPost";

const SAMPLE_POST: Post = {
  _id: "123",
  title: "Sample title",
  content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ",
  author: "User123",
  community: "main",
  creationDate: new Date(2024, 11, 15, 4, 59, 0, 0),
  editDate: new Date(2024, 11, 15, 4, 59, 0, 0)
}

export default function Feed() {
  return (
    <>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
      <FeedPost post={SAMPLE_POST}/>
    </>
  );
}