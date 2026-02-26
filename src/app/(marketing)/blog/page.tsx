import { client, queries } from "@/lib/sanity/client";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Artículos sobre Vida Consciente",
  description:
    "Descubre artículos sobre biocosmética natural, transformación personal, bienestar holístico y vida consciente. Comparte el conocimiento para una vida más plena.",
  keywords: [
    "blog vida consciente",
    "artículos biocosmética",
    "transformación personal",
    "bienestar holístico",
    "productos naturales",
    "autoconocimiento",
  ],
  openGraph: {
    title: "Blog - DA LUZ CONSCIENTE",
    description:
      "Artículos sobre vida consciente, biocosmética natural y transformación personal",
    type: "website",
  },
};

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author: {
    name: string;
    image?: { asset: { url: string } };
  };
  categories?: Array<{ title: string; color?: string }>;
  estimatedReadingTime?: number;
  featured?: boolean;
}

interface Category {
  _id: string;
  title: string;
  description?: string;
  color?: string;
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(
      queries.allPosts,
      {},
      {
        next: {
          revalidate: 60,
          tags: ["blog-posts", "sanity-content"],
        },
      }
    );
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch(
      queries.allCategories,
      {},
      {
        next: {
          revalidate: 120,
          tags: ["blog-categories", "sanity-content"],
        },
      }
    );
    return categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-cream)]/30">
      <BlogPageClient posts={posts} categories={categories} />
    </div>
  );
}
