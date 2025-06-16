export function getTags(posts: Array<{ data: { tags: string[] } }>) {
  const tagsCount = posts
    .flatMap((post) => post.data.tags)
    .reduce(
      (acc, tag) => {
        if (!acc[tag]) {
          return { ...acc, [tag]: 1 };
        }
        return {
          ...acc,
          [tag]: acc[tag] + 1,
        };
      },
      {} as Record<string, number>
    );
  const tags = Object.keys(tagsCount);
  return { tags, tagsCount };
}

export function filterByTag(posts: Array<{ data: { tags: string[] } }>, tag: string) {
  return posts.filter((post) => post.data.tags.includes(tag));
}
