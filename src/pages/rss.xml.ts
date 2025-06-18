import rss from '@astrojs/rss';
import type { APIContext } from "astro";
import { getCollection } from 'astro:content';

import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await  getCollection('blog');
  posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'Alexys Hegmann. Senior Software Engineer',
    description: 'I\'m a Software Engineer with 15+ years of experience and a deep love for clean code, clever architecture, and CSS that doesn\'t fight back.',
    site: context.site ?? "https://alexshegmann.tech",
    items: posts.map((post) => ({
      trailingSlash: false,
      title: post.data.title,
      pubDate: post.data.publishedAt,
      author: 'Alexys Hegmann',
      description: post.data.excerpt,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
      content: post.body ? sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }) : undefined,
    })),
  });
}