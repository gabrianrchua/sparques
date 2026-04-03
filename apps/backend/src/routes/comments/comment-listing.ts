import mongoose from 'mongoose';
import type { PipelineStage } from 'mongoose';
import Comment from '../../models/Comment.js';
import CommentVote from '../../models/CommentVote.js';

const DEFAULT_LIMIT = 20;

type CommentListResult = {
  _id: mongoose.Types.ObjectId | string;
  postId: mongoose.Types.ObjectId | string;
  parentId?: mongoose.Types.ObjectId | string;
  rootId: mongoose.Types.ObjectId | string;
  author: string;
  content: string;
  creationDate: Date;
  editDate: Date;
  depth: number;
  replyCount: number;
  numUpvotes: number;
  numDownvotes: number;
};

const encodeCursor = (score: number, id: string) =>
  Buffer.from(JSON.stringify({ score, id }), 'utf8').toString('base64url');

const decodeCursor = (cursor: string) => {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as { score?: unknown; id?: unknown };
    if (typeof parsed.score !== 'number' || typeof parsed.id !== 'string') {
      return undefined;
    }

    return parsed as { score: number; id: string };
  } catch {
    return undefined;
  }
};

const buildViewerVotes = async (
  comments: CommentListResult[],
  username?: string,
) => {
  const voteMap = new Map<string, 'up' | 'down'>();

  if (username && comments.length > 0) {
    const votes = await CommentVote.find({
      commentId: {
        $in: comments.map((comment) => new mongoose.Types.ObjectId(comment._id)),
      },
      author: username,
    });

    for (const vote of votes) {
      voteMap.set(vote.commentId.toString(), vote.isUpvote ? 'up' : 'down');
    }
  }

  return comments.map((comment) => ({
    ...comment,
    _id: comment._id.toString(),
    postId: comment.postId.toString(),
    parentId: comment.parentId?.toString(),
    rootId: comment.rootId.toString(),
    viewerVote: voteMap.get(comment._id.toString()) ?? null,
  }));
};

export const listComments = async (params: {
  match: Record<string, unknown>;
  cursor?: string;
  limit?: number;
  username?: string;
}) => {
  const limit = params.limit ?? DEFAULT_LIMIT;
  const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;
  const pipeline: PipelineStage[] = [
    { $match: params.match },
    {
      $addFields: {
        computedScore: { $subtract: ['$numUpvotes', '$numDownvotes'] },
      },
    },
  ];

  if (params.cursor) {
    if (!cursor || !mongoose.Types.ObjectId.isValid(cursor.id)) {
      throw new Error('Invalid cursor');
    }

    pipeline.push({
      $match: {
        $or: [
          { computedScore: { $lt: cursor.score } },
          {
            $and: [
              { computedScore: cursor.score },
              { _id: { $lt: new mongoose.Types.ObjectId(cursor.id) } },
            ],
          },
        ],
      },
    });
  }

  pipeline.push(
    { $sort: { computedScore: -1, _id: -1 } },
    { $limit: limit + 1 },
    {
      $project: {
        computedScore: 0,
      },
    },
  );

  const comments = (await Comment.aggregate(pipeline)) as CommentListResult[];
  const hasMore = comments.length > limit;
  const currentPage = hasMore ? comments.slice(0, limit) : comments;
  const items = await buildViewerVotes(currentPage, params.username);
  const lastComment = currentPage.at(-1);
  const nextCursor =
    hasMore && lastComment
      ? encodeCursor(
          lastComment.numUpvotes - lastComment.numDownvotes,
          lastComment._id.toString(),
        )
      : null;

  return { items, nextCursor };
};
