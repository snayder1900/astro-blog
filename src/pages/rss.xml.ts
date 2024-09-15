import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

export const GET: APIRoute = async ({ params, request, site }) => {
  const blogPosts = await getCollection("blog");

  return rss({
    // stylesheet: "/styles/rss.xsl",
    title: "Snayder Blog",
    description: "un simple blog sobre mis aventuras con astrojs",
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    site: site ?? "",
    items: blogPosts.map(({ data, slug, body }) => ({
      title: data.title,
      pubDate: data.date,
      description: data.description,
      link: `/posts/${slug}`,

      content: sanitizeHtml(parser.render(body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),

      customData: `<media:content
          type="image/${data.image.format === "jpg" ? "jpeg" : "png"}"
          width="${data.image.width}"
          height="${data.image.height}"
          medium="image"
          url="${site + data.image.src}" />
      `,
    })),
    customData: `<languaje>es-mx</languaje>`,
  });
};
