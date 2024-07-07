export function getSearchCacheKey(
  username: string | null,
  minDate: number | null,
  maxDate: number | null,
  requestingUserId: number | null,
): string {
  let keyParts: string[] = [];
  if (username) {
    keyParts.push(`username:${username}`);
  }
  if (minDate && maxDate) {
    keyParts.push(`daterange:${minDate}:${maxDate}`);
  } else if (minDate) {
    keyParts.push(`mindate:${minDate}`);
  } else if (maxDate) {
    keyParts.push(`maxdate:${maxDate}`);
  }
  if (requestingUserId) {
    keyParts.push(`blocked:${requestingUserId}`);
  }
  const cacheKey = `user:search:${keyParts.join(':')}`;
  return cacheKey;
}

export function getBlockedUsersCacheKey(userId: number): string {
  return `blocked-users:${userId}`;
}
