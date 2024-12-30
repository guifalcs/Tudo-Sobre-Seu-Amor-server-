import { Prisma } from '@prisma/client';

export type UserCreateData = Omit<
  Prisma.UserCreateInput,
  'specialDates' | 'timeline' | 'wishlist' | 'lovemap'
>;

export type UserUpdateData = Omit<
  Prisma.UserUpdateInput,
  'specialDates' | 'timeline' | 'wishlist' | 'lovemap'
>;