---
title: 'Implementing Search in Astro'
excerpt: I needed a search bar. I restrained myself so I didn't reinvent the wheel, so I used a package. How to add a search bar feature to your Astro site! The easy way.
publishedAt: 2025-06-17T17:30:00-0600
image: ../../assets/blog/2025/06/astro-search.jpeg
project: ah-dot-tech
tags:
  - Astro
  - Exploring tech
  - Quick how-to
  - Search engine
  - pagefind
---
# Implementing Search in Astro

Astro is a static site generator, but I knew there was a way to implement this without spinning up an overkill backend service just to index my silly little letters to the void.

I sometimes enjoy reinventing the wheel for my personal projects to learn a thing or two —you know what I'm talking about—, but this time, I just wanted to start blogging, so I popped up google and started looking for alternatives.

I ended up implementing `pagefind` just because it found a nice and easy [Astro extension called `astro-pagefind`](https://github.com/shishkin/astro-pagefind).

## Quick recipe for implementing Search in your Astro site

First install the dependency in your repo.

```
$ npm i astro-pagefind
```

Then add the integration to your Astro config:

```ts
//astro.config.ts

import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  // ...
  integrations: [pagefind()],
});
```

And finally add the Search component wherever you want the search bar:

```astro
---
import Search from "astro-pagefind/components/Search";
---

<Search id="search" className="pagefind-ui" />
```

Now, build your site as usual:

```
$ npm run build
```

And this is what makes the whole thing work:

```
$ npx pagefind --site ./dist
```

This creates a `pagefind` folder inside your `./dist` folder. This contains some javascript and support files that are called from the search bar.

Now go to your site and type in your brand new search bar.

Boom! Done! Next feature! Close the ticket.

## How to style the thing.

Right, the search works. I can see the results, but the bar and the result section look... off. It definitely doesn't match the site.

The integration does not say anything about styling your search bar and results, but when I did some digging in the main pagefind docs, I found out that the integration basically uses what they call "the default UI". You can style it a bit using CSS. They are pretty self explanatory.

```css
--pagefind-ui-scale: 1; /* <- I had to use a lower value. The text looked BIG  */
--pagefind-ui-primary: #034ad8;
--pagefind-ui-text: #393939;
--pagefind-ui-background: #ffffff;
--pagefind-ui-border: #eeeeee;
--pagefind-ui-tag: #eeeeee;
--pagefind-ui-border-width: 2px;
--pagefind-ui-border-radius: 8px;
--pagefind-ui-image-border-radius: 8px;
--pagefind-ui-image-box-ratio: 3 / 2;
--pagefind-ui-font: sans-serif;
```

Now, how do you keep things consistent with the whole thing if you are using Tailwind? Well, you can assign variables to these variables, so:

```css
/* This is equivalent to text-rose-500 */
--pagefind-ui-primary: var(---color-rose-500); 
```

This way you can use the same colors you are using in your site.

## Refining the index

Whenever I typed anything, the results were odd. The words on the navbar, the main logo and all the supporting elements of the pages were also getting indexed. This meant that the results were anything but useful.

I dove deeper and I found out there are certain tags you can add to your markup to enhance the index.

### Defining the main body: `data-pagefind-body`

The single page template for a blog has a very specific part that contains the meat of the page. The whole reason you are here is because you want to read these words, not really to look at the amazing AI generated BS image I added at the top. Well, that's the main body of the page.

We can mark it with `data-pagefind-body`. When you add this data attribute to a DOM element, you are telling pagefind what to index.

### Ignoring parts of the page: `data-pagefind-ignore`

When you add `data-pagefind-ignore` data attribute to a DOM element, the indexer will ignore it. This way you can ignore things like the footer or supporting text.

## Conclusion

Implementing search in your Astro site can be as easy as pulling pagefind, but if you want it to be really usefull, you have to purposely mark your DOM. And if you want it to look beautiful, you can use the built in CSS variables.

## Where to go next?

Should I build a home brew search result component leveraging pagefind?