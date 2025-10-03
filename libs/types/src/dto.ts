import { AnyStroke } from './interfaces.js';

export interface Vote {
  author: string;
  postId: string;
  isUpvote: boolean;
}

export interface CanvasDetails {
  _id: string;
  title: string;
  strokes: AnyStroke[];
  baseImage: string;
}

export interface CommentDetail {
  _id: string;
  postId: string | undefined;
  author: string;
  content: string;
  creationDate: Date;
  editDate: Date;
  parentId: string | undefined;
}

interface Image {
  mime: string;
  data: string;
}

export interface Community {
  title: string;
  bannerImage: Image | undefined;
  iconImage: Image | undefined;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  community: string;
  creationDate: Date;
  editDate: Date;
  numComments: number;
  numUpvotes: number;
  numDownvotes: number;
  comments: CommentDetail[] | undefined;
  votes: Vote[] | undefined;
}
