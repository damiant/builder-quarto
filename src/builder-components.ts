import { BUILDER_PUBLIC_API_KEY } from "./builder-page.ts";
import { escapeHtml, getFeaturedProducts, renderProductCard } from "./featured-products.ts";

type BuilderComponentInput = {
  name: string;
  type: string;
  defaultValue?: string | number | boolean;
};

type BuilderComponentOptions = {
  name: string;
  image?: string;
  inputs?: BuilderComponentInput[];
};

type BuilderRuntime = {
  init: (apiKey: string) => void;
  registerComponent: (component: (props?: Record<string, unknown>) => string | Promise<string>, options: BuilderComponentOptions) => void;
};

declare global {
  interface Window {
    Builder?: BuilderRuntime;
  }
}

const BUILDER_SDK_SCRIPT_ID = "builder-sdk-script";
const BUILDER_SDK_SRC = "https://cdn.builder.io/js/builder.min.js";

function getStringProp(props: Record<string, unknown> | undefined, name: string, defaultValue: string): string {
  const value = props?.[name];

  return typeof value === "string" ? value : defaultValue;
}

function getNumberProp(props: Record<string, unknown> | undefined, name: string, defaultValue: number): number {
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

function registerBuilderComponents(): void {
  if (!window.Builder) {
    return;
  }

  window.Builder.init(BUILDER_PUBLIC_API_KEY);
  window.Builder.registerComponent(renderBuilderFeaturedProducts, {
    name: "Featured Products",
    inputs: [
      { name: "eyebrow", type: "text", defaultValue: "Featured products" },
      { name: "title", type: "text", defaultValue: "Shop our latest essentials" },
      { name: "productCount", type: "number", defaultValue: 12 },
    ],
  });
  window.Builder.registerComponent(renderBuilderFeaturedProductCard, {
    name: "Featured Product Card",
    inputs: [
      { name: "title", type: "text", defaultValue: "Featured gadget" },
      { name: "description", type: "longText", defaultValue: "A curated Quarto product ready to feature on your page." },
      { name: "image", type: "file" },
      { name: "price", type: "number", defaultValue: 99 },
    ],
  });
}

export function loadBuilderComponentRegistry(): void {
  if (window.Builder) {
    registerBuilderComponents();
    return;
  }

  const existingScript = document.getElementById(BUILDER_SDK_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript) {
    existingScript.addEventListener("load", registerBuilderComponents, { once: true });
    return;
  }

  const builderScript = document.createElement("script");
  builderScript.id = BUILDER_SDK_SCRIPT_ID;
  builderScript.async = true;
  builderScript.src = BUILDER_SDK_SRC;
  builderScript.addEventListener("load", registerBuilderComponents, { once: true });
  document.head.append(builderScript);
}
