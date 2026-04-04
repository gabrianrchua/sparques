import { z } from 'zod';

const image = z.object({
  mime: z.string(),
  data: z.string(),
});
type Image = z.infer<typeof image>;

export const GetCommunitiesQuery = z.object({
  title: z.string().optional(),
});
export type GetCommunitiesQuery = z.infer<typeof GetCommunitiesQuery>;

export const CreateCommunityBody = z.object({
  title: z.string(),
  bannerImage: image.optional(),
  iconImage: image.optional(),
});
export type CreateCommunityBody = {
  title: string;
  bannerImage?: Image;
  iconImage?: Image;
};

export const UpdateCommunityBody = z.object({
  bannerImage: image.optional(),
  iconImage: image.optional(),
});
export type UpdateCommunityBody = z.infer<typeof UpdateCommunityBody>;
