"use client";

import { BentoBlogCard } from "./BentoBlogCard";
import BlogCard from "./BlogCard";

export interface BlogPostForBento {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author?: { name: string };
  categories?: Array<{ title: string; color?: string }>;
  featured?: boolean;
}

interface BentoBlogGridProps {
  posts: BlogPostForBento[];
}

/**
 * Bento grid layout matching reference:
 * - Row 1: Lead post (full-width, large, image right)
 * - Row 2: Two medium cards (half-width each, image left/right)
 * - Row 3: Two small cards (half-width each, text only)
 * - Row 4: Bottom post (full-width, shorter, small image right)
 */
export function BentoBlogGrid({ posts }: BentoBlogGridProps) {
  if (posts.length === 0) return null;

  const bentoPosts = posts.slice(0, 6);
  const [lead, ...rest] = bentoPosts;
  const mediumPosts = rest.slice(0, 2);
  const smallPosts = rest.slice(2, 4);
  const bottomPost = rest[4];
  const remainingPosts = posts.slice(6);

  const getExcerpt = (post: BlogPostForBento) =>
    post.excerpt || "Descubre más sobre este tema en nuestro blog.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {/* Row 1: Lead post - full width */}
      {lead && (
        <div className="md:col-span-2">
          <BentoBlogCard
            title={lead.title}
            excerpt={getExcerpt(lead)}
            slug={lead.slug.current}
            publishedAt={lead.publishedAt}
            mainImage={lead.mainImage}
            variant="lead"
          />
        </div>
      )}

      {/* Row 2: Two medium cards - image left, image right */}
      {mediumPosts[0] && (
        <BentoBlogCard
          title={mediumPosts[0].title}
          excerpt={getExcerpt(mediumPosts[0])}
          slug={mediumPosts[0].slug.current}
          publishedAt={mediumPosts[0].publishedAt}
          mainImage={mediumPosts[0].mainImage}
          variant="medium-left"
        />
      )}
      {mediumPosts[1] && (
        <BentoBlogCard
          title={mediumPosts[1].title}
          excerpt={getExcerpt(mediumPosts[1])}
          slug={mediumPosts[1].slug.current}
          publishedAt={mediumPosts[1].publishedAt}
          mainImage={mediumPosts[1].mainImage}
          variant="medium-right"
        />
      )}

      {/* Row 3: Two small cards - text only */}
      {smallPosts[0] && (
        <BentoBlogCard
          title={smallPosts[0].title}
          excerpt={getExcerpt(smallPosts[0])}
          slug={smallPosts[0].slug.current}
          publishedAt={smallPosts[0].publishedAt}
          mainImage={smallPosts[0].mainImage}
          variant="small"
        />
      )}
      {smallPosts[1] && (
        <BentoBlogCard
          title={smallPosts[1].title}
          excerpt={getExcerpt(smallPosts[1])}
          slug={smallPosts[1].slug.current}
          publishedAt={smallPosts[1].publishedAt}
          mainImage={smallPosts[1].mainImage}
          variant="small"
        />
      )}

      {/* Row 4: Bottom post - full width, small image right */}
      {bottomPost && (
        <div className="md:col-span-2">
          <BentoBlogCard
            title={bottomPost.title}
            excerpt={getExcerpt(bottomPost)}
            slug={bottomPost.slug.current}
            publishedAt={bottomPost.publishedAt}
            mainImage={bottomPost.mainImage}
            variant="bottom"
          />
        </div>
      )}

      {/* Remaining posts - standard grid */}
      {remainingPosts.length > 0 && (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {remainingPosts.map((post) => (
            <BlogCard
              key={post._id}
              id={post._id}
              title={post.title}
              excerpt={getExcerpt(post)}
              slug={post.slug.current}
              publishedAt={post.publishedAt}
              mainImage={post.mainImage}
              author={post.author || { name: "DA LUZ" }}
              categories={post.categories}
              featured={post.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
