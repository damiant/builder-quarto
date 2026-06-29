import { Builder, builder, type Component } from "@builder.io/sdk";
import { BUILDER_PUBLIC_API_KEY } from "./builder-page.ts";
import { escapeHtml, getFeaturedProducts, renderProductCard } from "./featured-products.ts";

type BuilderComponentProps = Record<string, unknown> | undefined;

const featuredProductsRegistration: Component = {
  name: "Featured Products",
  inputs: [
    { name: "eyebrow", type: "text", defaultValue: "Featured products" },
    { name: "title", type: "text", defaultValue: "Shop our latest essentials" },
    { name: "productCount", type: "number", defaultValue: 12 },
  ],
};

const featuredProductCardRegistration: Component = {
  name: "Featured Product Card",
  inputs: [
    { name: "title", type: "text", defaultValue: "Featured gadget" },
    { name: "description", type: "longText", defaultValue: "A curated Quarto product ready to feature on your page." },
    { name: "image", type: "file" },
    { name: "price", type: "number", defaultValue: 99 },
  ],
};

let builderComponentsRegistered = false;

function getStringProp(props: BuilderComponentProps, name: string, defaultValue: string): string {
  const value = props?.[name];

  return typeof value === "string" ? value : defaultValue;
}

function getNumberProp(props: BuilderComponentProps, name: string, defaultValue: number): number {
  const value = props?.[name];

  return typeof value === "number" ? value : defaultValue;
}

async function renderBuilderFeaturedProducts(props?: Record<string, unknown>): Promise<string> {
  const eyebrow = getStringProp(props, "eyebrow", "Featured products");
  const title = getStringProp(props, "title", "Shop our latest essentials");
  const productCount = getNumberProp(props, "productCount", 12);
  const featuredProducts = await getFeaturedProducts(productCount);

  return `
    <section class="featured-products" aria-labelledby="featured-products-title">
      <div class="featured-products-header">
        <p class="featured-products-eyebrow">${escapeHtml(eyebrow)}</p>
        <h2 id="featured-products-title" class="featured-products-title">${escapeHtml(title)}</h2>
      </div>
      <div class="featured-products-grid">
        ${featuredProducts.map(renderProductCard).join("")}
      </div>
    </section>
  `;
}

function renderBuilderFeaturedProductCard(props?: Record<string, unknown>): string {
  return renderProductCard({
    title: getStringProp(props, "title", "Featured gadget"),
    description: getStringProp(props, "description", "A curated Quarto product ready to feature on your page."),
    image: getStringProp(props, "image", ""),
    price: getNumberProp(props, "price", 99),
  });
}

export function registerBuilderComponents(): void {
  if (builderComponentsRegistered) {
    return;
  }

  builder.init(BUILDER_PUBLIC_API_KEY);
  Builder.registerComponent(renderBuilderFeaturedProducts, featuredProductsRegistration);
  Builder.registerComponent(renderBuilderFeaturedProductCard, featuredProductCardRegistration);
  builderComponentsRegistered = true;
}
