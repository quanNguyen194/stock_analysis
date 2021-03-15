import md5 from "md5";

/**
 * Hash string
 * @param str ..
 * @returns string
 */
export const HashString = (str: string): string => {
  if (!str) return "";
  return md5(str);
};

/**
 * Compare md5 string
 * @param str ..
 * @param md5Str ..
 * @returns boolean
 */
export const CompareMD5String = (str: string, md5Str: string): boolean => {
  if (!str) return false;
  if (md5(str) === md5Str) return true;
  return false;
};
