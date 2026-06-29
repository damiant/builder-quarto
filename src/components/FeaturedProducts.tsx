import { useEffect, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { ProductCard, getProductSlug, type Product } from "./ProductCard.tsx";

type BuilderProductContent = {
  data?: Partial<Product>;
};

type BuilderProductsResponse = {
  results?: BuilderProductContent[];
};

function normalizeProduct(content: BuilderProductContent): Product | null {
  const { title, description, image, price } = content.data ?? {};
  if (!title || typeof price !== "number") return null;
  return { title, slug: getProductSlug(title), description, image, price };
}

export async function fetchFeaturedProducts(productCount = 12): Promise<Product[]> {
  const productsUrl = new URL("https://cdn.builder.io/api/v3/content/products");
  productsUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  productsUrl.searchParams.set("limit", productCount.toString());
  productsUrl.searchParams.set("fields", "data.title,data.description,data.image,data.price");

  const response = await fetch(productsUrl);
  if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);

  const data = (await response.json()) as BuilderProductsResponse;
  return (data.results ?? []).map(normalizeProduct).filter((p): p is Product => Boolean(p));
}

type FeaturedProductsProps = {
  eyebrow?: string;
  title?: string;
  productCount?: number;
};

export const featuredProductsBuilderConfig = {
  name: "Featured Products",
  inputs: [
    { name: "eyebrow", type: "text", defaultValue: "Featured products" },
    { name: "title", type: "text", defaultValue: "Shop our latest essentials" },
    { name: "productCount", type: "number", defaultValue: 12 },
  ],
};

export function FeaturedProducts({
  eyebrow = "Featured products",
  title = "Shop our latest essentials",
  productCount = 12,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts(productCount).then(setProducts).catch(console.error);
  }, [productCount]);

  return (
    <section className="featured-products" aria-labelledby="featured-products-title">
      <div className="featured-products-header">
        <p className="featured-products-eyebrow">{eyebrow}</p>
        <h2 id="featured-products-title" className="featured-products-title">
          {title}
        </h2>
      </div>
      <div className="featured-products-grid">
        {products.map((product, i) => (
          <ProductCard key={i} {...product} />
        ))}
      </div>
    </section>
  );
}
