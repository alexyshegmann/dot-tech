---
title: 'Implementing a Share button with Preact in Astro'
excerpt: 'Dipping my toe in Preact. I wanted to create a quick and dirty component to ✨feel✨ Preact as an experienced React developer. Spoiler alert: it was a breeze.'
publishedAt: 2025-06-20T17:30:00-0600
image: ../../assets/blog/2025/06/astro-preact.jpeg
project: ah-dot-tech
tags:
  - Astro
  - Preact
  - Exploring tech
  - Quick how-to
---
# Implementing a Share button with Preact in Astro

Since I started working on this blog, I've come across a couple of new technologies I've been wanting to try out, but I haven't had any actual project that I can use as a test ground. One of this technologies is Preact.

I've been a React developer for 10 years. JSX is second nature to me now up to the point I mindlessly choose React for any pet project just because it's easy enough to just spin up an SPA with Vite and start working. But Preact has been gaining tracktion for years because of how small the footprint is and how easy it is to migrate from React to Preact.

Well, I wanted to experience it in my own skin, so how about we refactor our [Share button](/blog/astro-share-button) using Preact!

## Quick recipe for implementing a Share button in Astro

As easy as it sounds, you can let Astro install it for you:

```
$ npx astro add preact
```

Let it cook and that's it. You can start writing Preact components.

Let's recreate our Share Button with Preact. You can style it however you want.

```jsx
// ShareButton.tsx <- for Type safety 👍
interface ShareButtonProps {
  title: string;
  href: string;
}

export default function ShareButton({ title, href }: ShareButtonProps) {
  const hndClick = () => {
    // You'll do stuff here later
  };

  return (
    <button onClick={hndClick}>Share</button>
  );
}
```

Now we can bring the event handler from our Astro component and stick it into our function. Remember, just the event handler, not the listener binding stuff.

```ts
const hndClick = () => {
  if (navigator.share) {
    await navigator.share({
      title,
      url: href,
    });
  } else {
    await navigator.clipboard.writeText(
      `${title} - ${href}`
    );
    alert("URL Copied to clipboard.");
  }
};
```

And we can import it in our Astro page:

```astro
---
import ShareButton from "../../components/ShareButton";
---

<ShareButton title={post.data.title} href={Astro.url.toString()} client:load />

```

Note the `client:load` bit. This is important. In Astro, this is called a **Client directive** (see [more](https://docs.astro.build/en/reference/directives-reference/#client-directives)). Directives control how different elements are rendered and hydrated on the client. This one tells the render to immediately load and hydrate the component javascript directly on load so we can click it as soon as we can see it.

## Conclusion

Coming from React into Preact with this super simple component was a breeze. I looked at the Preact docs to see where the similarities ended and I was surprised how similar they are.
The issues I found while adding this component were totally my fault because of my inexperience with dynamic JS in Astro (eg: the client directives).

Should we build something more exciting? 🤓
