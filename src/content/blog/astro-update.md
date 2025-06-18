---
title: 'Astro update'
excerpt: I've learned a couple of new tricks for my new Astro page. Search? You got it. Meta tags? Go for it.
publishedAt: 2025-06-17T13:30:00-0600
image: ../../assets/blog/2025/06/astro-update.jpeg
project: ah-dot-tech
tags:
  - Astro
  - Exploring tech
---
# The Astro Update

A couple of things have happended since my last post. I was even posting to a different blog altogether (also powered by Astro). But when building this site you are visiting, I had to revisit Astro docs and I wanted to implement a couple of features.

## Search bar

I wanted to include some sort of search feature. You sometimes remember reading something somewhere; you remember the creator, but you don't have handy the link. What do you do? You search for the thing.

I ended up using `pagefind` for my search bar. If you want to read how, [you can read it here](/blog/astro-search).

## Share button

Sure, you can just copy the URL and paste it somewhere else, but having a dedicated share button makes it easier, and easier means happy users.

Well, there's also a hidden gem in the browser APIs: the [share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).

If you want to know how I implemented the button, [you can read about it here](/blog/astro-share-button).