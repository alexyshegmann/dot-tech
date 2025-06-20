interface ShareButtonProps {
  title: string;
  href: string;
}

export default function ShareButton({ title, href }: ShareButtonProps) {
  const hndClick = async () => {
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
  return (
    <button
      class="bg-rose-500 hover:text-gray-900 hover:bg-rose-200 text-gray-50 transition-colors p-4 rounded-full cursor-pointer"
      data-title={title}
      data-href={href}
      onClick={hndClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
        ></path>
      </svg>
    </button>
  );
}
