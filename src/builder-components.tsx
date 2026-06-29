import { Builder } from "@builder.io/react";
import { FeaturedProducts } from "./components/FeaturedProducts.tsx";
import { ProductCard } from "./components/ProductCard.tsx";

Builder.registerComponent(FeaturedProducts, {
  name: "Featured Products",
  inputs: [
    { name: "eyebrow", type: "text", defaultValue: "Featured products" },
    { name: "title", type: "text", defaultValue: "Shop our latest essentials" },
    { name: "productCount", type: "number", defaultValue: 12 },
  ],
});

Builder.registerComponent(ProductCard, {
  name: "Featured Product Card",
  inputs: [
    { name: "title", type: "text", defaultValue: "Featured gadget" },
    {
      name: "description",
      type: "longText",
      defaultValue: "A curated Quarto product ready to feature on your page.",
    },
    { name: "image", type: "file" },
    { name: "price", type: "number", defaultValue: 99 },
  ],
});
