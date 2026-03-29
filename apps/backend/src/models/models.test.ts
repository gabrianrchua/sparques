import bcrypt from 'bcrypt';
import { describe, expect, it } from 'vitest';

import Canvas from './Canvas.js';
import Comment from './Comment.js';
import Community from './Community.js';
import Post from './Post.js';
import { Brush } from './Stroke.js';
import User from './User.js';
import Vote from './Vote.js';

describe('models', () => {
  it('applies canvas defaults and requires a base image', () => {
    const canvas = new Canvas({ title: 'main', baseImage: 'abc' });

    expect(canvas.strokes).toEqual([]);
    expect(canvas.validateSync()).toBeUndefined();
    expect(new Canvas({ title: 'main' }).validateSync()).toBeDefined();
  });

  it('applies post defaults', () => {
    const post = new Post({
      title: 'hello',
      content: 'world',
      author: 'alice',
      community: 'main',
    });

    expect(post.numComments).toBe(0);
    expect(post.numUpvotes).toBe(0);
    expect(post.numDownvotes).toBe(0);
    expect(post.validateSync()).toBeUndefined();
  });

  it('validates community and vote required fields', () => {
    expect(new Community({}).validateSync()).toBeDefined();
    expect(
      new Vote({ postId: '507f191e810c19729de860ea' }).validateSync(),
    ).toBeDefined();
  });

  it('keeps optional comment parent ids undefined by default', () => {
    const comment = new Comment({
      postId: '507f191e810c19729de860ea',
      author: 'alice',
      content: 'reply',
    });

    expect(comment.parentId).toBeUndefined();
    expect(comment.validateSync()).toBeUndefined();
  });

  it('builds discriminator models for strokes', () => {
    const brush = new Brush({
      color: '#000',
      width: 2,
      coordinates: [{ x: 1, y: 2 }],
    });

    expect(brush.type).toBe('Brush');
    expect(brush.validateSync()).toBeUndefined();
  });

  it('compares passwords through the user instance method', async () => {
    const user = new User({
      username: 'alice',
      password: bcrypt.hashSync('secret', 1),
    });

    const samePassword = await new Promise<boolean | undefined>((resolve) => {
      user.isCorrectPassword('secret', (_error, same) => resolve(same));
    });

    expect(samePassword).toBe(true);
  });
});
