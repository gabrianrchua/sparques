import { z } from 'zod';

const image = z.object({
  mime: z.string(),
  data: z.string(),
});

export const GetCommunitiesQuery = z.object({
  title: z.string().optional(),
});

export const CreateCommunityBody = z.object({
  title: z.string(),
  bannerImage: image.optional(),
  iconImage: image.optional(),
});

export const UpdateCommunityBody = z.object({
  bannerImage: image.optional(),
  iconImage: image.optional(),
});
