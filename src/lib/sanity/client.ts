import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Standard client for data fetching
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Preview client for draft content
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper function to get client based on preview mode
export function getClient(usePreview = false) {
  return usePreview ? previewClient : client
}

// Common GROQ queries
export const queries = {
  // Posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author->{name, image, bio},
    categories[]->{title, color},
    featured,
    "estimatedReadingTime": round(length(pt::text(content)) / 5 / 200)
  }`,
  
  // Debug query to check all fields
  debugPostBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    contenido,
    content,
    "allFields": *
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    "mainImage": {
      "asset": {"url": mainImage.asset->url},
      "alt": mainImage.alt
    },
    publishedAt,
    author->{
      name, 
      "image": image.asset->url, 
      bio, 
      socialLinks
    },
    categories[]->{title, color},
    seo,
    featured,
    "estimatedReadingTime": round(length(pt::text(content)) / 5 / 200)
  }`,

  // Categories
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    description,
    color
  }`,

  // Products
  allProducts: `*[_type == "productContent"] | order(name asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    price,
    isAvailable,
    categories[]->{title, color},
    certifications
  }`,

  productBySlug: `*[_type == "productContent" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    shortDescription,
    fullDescription,
    mainImage,
    gallery,
    price,
    isAvailable,
    ingredients,
    benefits,
    howToUse,
    certifications,
    categories[]->{title, color},
    seo
  }`,

  // Membership
  membershipContent: `*[_type == "membershipContent"][0] {
    _id,
    title,
    subtitle,
    description,
    mainImage,
    price,
    duration,
    modules,
    benefits,
    exercises,
    downloads,
    testimonials[]->,
    seo
  }`,

  // Testimonials
  allTestimonials: `*[_type == "testimonial"] | order(featured desc, _createdAt desc) {
    _id,
    name,
    role,
    content,
    rating,
    image,
    beforeAfterImages,
    featured,
    verified,
    location
  }`,

  featuredTestimonials: `*[_type == "testimonial" && featured == true] | order(_createdAt desc) {
    _id,
    name,
    role,
    content,
    rating,
    image,
    beforeAfterImages,
    location
  }`,

  // Pages
  pageBySlug: `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    seo
  }`,

  // Authors
  allAuthors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    bio,
    image,
    socialLinks
  }`
}

// Helper functions for fetching data
export async function getAllPosts(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.allPosts)
}

export async function getPostBySlug(slug: string, usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.postBySlug, { slug })
}

export async function getAllCategories(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.allCategories)
}

export async function getAllProducts(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.allProducts)
}

export async function getProductBySlug(slug: string, usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.productBySlug, { slug })
}

export async function getMembershipContent(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.membershipContent)
}

export async function getAllTestimonials(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.allTestimonials)
}

export async function getFeaturedTestimonials(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.featuredTestimonials)
}

export async function getPageBySlug(slug: string, usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.pageBySlug, { slug })
}

export async function getAllAuthors(usePreview = false) {
  const client = getClient(usePreview)
  return await client.fetch(queries.allAuthors)
} 