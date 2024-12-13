import { User } from "./supabase.tables";

export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T] &
  Partial<T>;

  export const hasAtLeastOneField = (obj: Partial<User>): obj is AtLeastOne<User> => {
    return Object.values(obj).some((value) => value !== undefined);
  };
