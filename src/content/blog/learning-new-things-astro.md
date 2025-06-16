---
title: 'Learning new things: Astro'
excerpt: 'This website was made with Astro. If you want a quick overview, take a look.'
publishedAt: '2025-11-10T13:23:00'
image: '../../assets/blog/2024/08/astro.jpeg'
project: ah-dot-tech
tags:
  - Astro
  - Exploring tech
---
# Learning new things: Astro

## TL;DR
This website was made with Astro. If you want a quick overview, take a look.

## Context

When I started working on my website, I had several options for which stack to use. After so many years of working with React, it's naturally the first solution that comes to mind. However, for the kind of site I wanted to create, using React would likely cause more headaches than it would help. Another quick solution was to use WordPress, as I've used it enough to feel comfortable with it. But I felt that using it would limit me in achieving what I really wanted. I even considered using plain HTML, with the spirit of going back to the old web, but that reminded me of my early years of development, where I'd copy and paste a template every time I wanted to add a post; not ideal either.

Then, I remembered a framework I recently learned about at work that seemed promising: [Astro](https://astro.build/).

## What is Astro?

Astro is a framework for content-based websites. Basically, exactly what I had in mind.

The syntax caught my attention right from the start: it’s very similar to React and is based on components that receive props. But the best part is that it’s server-first, so I didn’t have to worry about server-side rendering or anything like that; it’s built-in. It also natively integrates Markdown with front matter, which I feel is the best way to write and categorize content since it’s plain text, and metadata is in the same file. No need to mess around with databases or serialized formatted text—everything works out of the box. It even supports TypeScript.

With great excitement, I ran the command to create a new project and started playing around with the code. The hardest part has been figuring out which functions run at compile time and which run at runtime. But in the end, I got my Markdown posts to display.

To be honest, the layout and design aren’t the most beautiful in the world, but I wanted to publish this as quickly as possible to keep the motivation alive.

I felt very satisfied learning something new and making something just for myself. These kinds of projects add years to my life.

## How to Make a Site with Astro

Here’s the quick version of what I’ve learned:

Make sure you have Node and NPM installed. Check with `node -v` to confirm you have Node 20.

Run `npm create astro@latest` in the terminal and answer the questions in the wizard. When you’re done, you’ll have a folder with everything ready to go. Just make sure to run `npm install` in the wizard or after finishing. To start the development server, run `npm run dev` and open a browser at http://localhost:4321. Boom! You’re all set.

Now, the key things to know:

* Everything in `src/pages/` will be a page that can be visited, and the index is where you start.
* The folder structure will be preserved. Subfolders will generate subfolders.
* Collections define content types. In my case, each post is in the blog collection.
* Collections are defined in `src/content/config.ts`. Here, you can define the type name and the metadata structure.
* To generate pages that consume collections, define a `getStaticPaths` function that satisfies `GetStaticPaths`. This function will be called at compile time to generate all the final HTML files. In this function, you need to call `getCollection('blog')`, which returns a promise with an array of items in the collection.

And that’s it. You can define .astro files, import them, and use them as components. These components can receive props.

```astro
// === Heading.astro ===
---
interface Props {
  text: string;
  link?: string;
}

const { text, link } = Astro.props;
---

<h2>
  {link !== undefined ? <a href={link}>{text}</a> : text}
</h2>


// === index.astro ===
<Heading text="Home" link="/" />
```

I’ll probably make more posts about what I learn along the way.
