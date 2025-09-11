import Post from '../../models/Post';
import { Request, Response } from 'express';

export const getPosts = async (req: Request, res: Response) => {
  // TODO: also filter by author
  const community = req.query.community; // optional filter by community

  try {
    if (res.locals.username) {
      // if user is logged in, join with vote status (up, down, none)
      if (community) {
        // filter by community too
        const posts = await Post.aggregate([
          { $match: { community } },
          {
            $lookup: {
              from: 'votes',
              let: { postId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$postId', '$$postId'] },
                        { $eq: ['$author', res.locals.username] },
                      ],
                    },
                  },
                },
              ],
              as: 'votes',
            },
          },
        ]).sort({ creationDate: 'descending' });
        res.json(posts);
      } else {
        // no filter by community
        const posts = await Post.aggregate([
          {
            $lookup: {
              from: 'votes',
              let: { postId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$postId', '$$postId'] },
                        { $eq: ['$author', res.locals.username] },
                      ],
                    },
                  },
                },
              ],
              as: 'votes',
            },
          },
        ]).sort({ creationDate: 'descending' });
        res.json(posts);
      }
    } else {
      // user not logged in
      if (community) {
        // filter by community
        const posts = await Post.find({ community }).sort({
          creationDate: 'descending',
        });
        res.json(posts);
      } else {
        // no filter by community
        const posts = await Post.find().sort({ creationDate: 'descending' });
        res.json(posts);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
