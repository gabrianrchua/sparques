import { AnyStroke } from './interfaces.js';

export interface PostVote {
  author: string;
  postId: string;
  isUpvote: boolean;
}

export interface CommentVote {
  author: string;
  commentId: string;
  isUpvote: boolean;
}

export interface CanvasDetails {
  _id: string;
  title: string;
  strokes: AnyStroke[];
  baseImage: string;
}

export type ViewerVote = 'up' | 'down' | null;

export interface CommentNode {
  _id: string;
  postId: string;
  rootId: string;
  author: string;
  content: string;
  creationDate: Date;
  editDate: Date;
  parentId: string | undefined;
  depth: number;
  replyCount: number;
  numUpvotes: number;
  numDownvotes: number;
  viewerVote: ViewerVote;
}

export interface CommentPage {
  items: CommentNode[];
  nextCursor: string | null;
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
  votes: PostVote[] | undefined;
}
