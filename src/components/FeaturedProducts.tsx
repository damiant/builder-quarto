import { useEffect, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { ProductCard, getProductSlug, type Product } from "./ProductCard.tsx";

type BuilderReference = {
  id?: string;
};

type BuilderProductContent = {
  data?: Partial<Product> & {
    category?: BuilderReference;
    tags?: BuilderReference;
  };
};

type BuilderContentWithTitle = {
  id?: string;
  data?: {
    title?: string;
    description?: string;
  };
};

type TagDetails = {
  title: string;
  description?: string;
};

type BuilderProductsResponse = {
  results?: BuilderProductContent[];
};

type BuilderContentWithTitleResponse = {
  results?: BuilderContentWithTitle[];
};

export function getCategorySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(content: BuilderProductContent): Product | null {
  const { title, description, image, price, category, tags, sku } = content.data ?? {};
  if (!title || typeof price !== "number") return null;
  return {
    title,
    slug: getProductSlug(title),
    sku,
    description,
    image,
    price,
    categoryId: category?.id,
    tagId: tags?.id,
  };
}

async function getContentByTitle(
  modelName: string,
  value: string,
): Promise<BuilderContentWithTitle | null> {
  const contentUrl = new URL(`https://cdn.builder.io/api/v3/content/${modelName}`);
  contentUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  contentUrl.searchParams.set("limit", "100");
  contentUrl.searchParams.set("fields", "id,data.title,data.description");

  const response = await fetch(contentUrl);
  if (!response.ok) throw new Error(`Failed to load ${modelName}: ${response.status}`);

  const data = (await response.json()) as BuilderContentWithTitleResponse;
  const valueSlug = getCategorySlug(value);

  return (
    (data.results ?? []).find((item) => {
      const title = item.data?.title;
      return title ? getCategorySlug(title) === valueSlug : false;
    }) ?? null
  );
}

async function getContentIdByTitle(modelName: string, value: string): Promise<string | null> {
  const content = await getContentByTitle(modelName, value);
  return content?.id ?? null;
}

async function fetchTagDetails(tag: string): Promise<TagDetails | null> {
  const content = await getContentByTitle("tags", tag);
  const title = content?.data?.title;
  if (!title) return null;
  return {
    title,
    description: content.data?.description,
  };
}

export async function fetchFeaturedProducts(
  productCount = 12,
  category?: string,
  tag?: string,
): Promise<Product[]> {
  const productsUrl = new URL("https://cdn.builder.io/api/v3/content/products");
  productsUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  productsUrl.searchParams.set("limit", category || tag ? "100" : productCount.toString());
  productsUrl.searchParams.set(
    "fields",
    "data.title,data.description,data.image,data.price,data.category,data.tags,data.sku",
  );

  const [response, categoryId, tagId] = await Promise.all([
    fetch(productsUrl),
    category ? getContentIdByTitle("categories", category) : Promise.resolve(null),
    tag ? getContentIdByTitle("tags", tag) : Promise.resolve(null),
  ]);
  if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);

  const data = (await response.json()) as BuilderProductsResponse;
  const products = (data.results ?? [])
    .map(normalizeProduct)
    .filter((p): p is Product => Boolean(p));
  const filteredProducts = products.filter((product) => {
    if (category && (!categoryId || product.categoryId !== categoryId)) return false;
    if (tag && (!tagId || product.tagId !== tagId)) return false;
    return true;
  });

  return filteredProducts.slice(0, productCount);
}

type FeaturedProductsProps = {
  eyebrow?: string;
  title?: string;
  productCount?: number;
  category?: string;
  tag?: string;
};

export const featuredProductsBuilderConfig = {
  name: "Featured Products",
  inputs: [
    { name: "eyebrow", type: "text", defaultValue: "Featured products" },
    { name: "title", type: "text", defaultValue: "Shop our latest essentials" },
    { name: "productCount", type: "number", defaultValue: 12 },
    {
      name: "category",
      type: "text",
      helperText: "Optional category title or slug, for example Smartphones or smartphones.",
    },
    {
      name: "tag",
      type: "text",
      helperText: "Optional tag title or slug, for example Gift Idea or gift-idea.",
    },
  ],
};

export function FeaturedProducts({
  eyebrow = "Featured products",
  title = "Shop our latest essentials",
  productCount = 12,
  category,
  tag,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [tagDetails, setTagDetails] = useState<TagDetails | null>(null);

  useEffect(() => {
    fetchFeaturedProducts(productCount, category, tag).then(setProducts).catch(console.error);
  }, [productCount, category, tag]);

  useEffect(() => {
    if (!tag) {
      setTagDetails(null);
      return;
    }

    fetchTagDetails(tag).then(setTagDetails).catch(console.error);
  }, [tag]);

  const headingTitle = tagDetails?.title ?? title;

  return (
    <section className="featured-products" aria-labelledby="featured-products-title">
      <div className="featured-products-header">
        <p className="featured-products-eyebrow">{eyebrow}</p>
        <h2 id="featured-products-title" className="featured-products-title">
          {headingTitle}
        </h2>
        {tagDetails?.description && (
          <div className="featured-products-tag-summary">
            <p className="featured-products-tag-description">{tagDetails.description}</p>
          </div>
        )}
      </div>
      {products.length > 0 ? (
        <div className="featured-products-grid">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      ) : (
        <p className="featured-products-empty">No products found.</p>
      )}
    </section>
  );
}
