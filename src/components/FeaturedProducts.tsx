import { useEffect, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { ProductCard, getProductSlug, type Product } from "./ProductCard.tsx";

type BuilderReference = {
  id?: string;
};

type BuilderProductContent = {
  data?: Partial<Product> & {
    category?: BuilderReference;
  };
};

type BuilderCategoryContent = {
  id?: string;
  data?: {
    title?: string;
  };
};

type BuilderProductsResponse = {
  results?: BuilderProductContent[];
};

type BuilderCategoriesResponse = {
  results?: BuilderCategoryContent[];
};

export function getCategorySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(content: BuilderProductContent): Product | null {
  const { title, description, image, price, category, sku } = content.data ?? {};
  if (!title || typeof price !== "number") return null;
  return {
    title,
    slug: getProductSlug(title),
    sku,
    description,
    image,
    price,
    categoryId: category?.id,
  };
}

async function getCategoryId(category: string): Promise<string | null> {
  const categoriesUrl = new URL("https://cdn.builder.io/api/v3/content/categories");
  categoriesUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  categoriesUrl.searchParams.set("limit", "100");
  categoriesUrl.searchParams.set("fields", "id,data.title");

  const response = await fetch(categoriesUrl);
  if (!response.ok) throw new Error(`Failed to load categories: ${response.status}`);

  const data = (await response.json()) as BuilderCategoriesResponse;
  const categorySlug = getCategorySlug(category);
  const match = (data.results ?? []).find((item) => {
    const title = item.data?.title;
    return title ? getCategorySlug(title) === categorySlug : false;
  });

  return match?.id ?? null;
}

export async function fetchFeaturedProducts(
  productCount = 12,
  category?: string,
): Promise<Product[]> {
  const productsUrl = new URL("https://cdn.builder.io/api/v3/content/products");
  productsUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  productsUrl.searchParams.set("limit", category ? "100" : productCount.toString());
  productsUrl.searchParams.set(
    "fields",
    "data.title,data.description,data.image,data.price,data.category,data.sku",
  );

  const [response, categoryId] = await Promise.all([
    fetch(productsUrl),
    category ? getCategoryId(category) : Promise.resolve(null),
  ]);
  if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);

  const data = (await response.json()) as BuilderProductsResponse;
  const products = (data.results ?? [])
    .map(normalizeProduct)
    .filter((p): p is Product => Boolean(p));
  const filteredProducts = category
    ? products.filter((product) => product.categoryId === categoryId)
    : products;

  return filteredProducts.slice(0, productCount);
}

type FeaturedProductsProps = {
  eyebrow?: string;
  title?: string;
  productCount?: number;
  category?: string;
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
  ],
};

export function FeaturedProducts({
  eyebrow = "Featured products",
  title = "Shop our latest essentials",
  productCount = 12,
  category,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts(productCount, category).then(setProducts).catch(console.error);
  }, [productCount, category]);

  return (
    <section className="featured-products" aria-labelledby="featured-products-title">
      <div className="featured-products-header">
        <p className="featured-products-eyebrow">{eyebrow}</p>
        <h2 id="featured-products-title" className="featured-products-title">
          {title}
        </h2>
      </div>
      {products.length > 0 ? (
        <div className="featured-products-grid">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      ) : (
        <p className="featured-products-empty">No products found in this category.</p>
      )}
    </section>
  );
}
