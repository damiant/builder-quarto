import { Builder } from "@builder.io/react";
import { FeaturedProducts } from "./components/FeaturedProducts.tsx";
import { ProductCard } from "./components/ProductCard.tsx";
import { ContentHeader } from "./components/ContentHeader.tsx";

Builder.registerComponent(ContentHeader, {
  name: "ContentHeader",
  inputs: [
    { name: "title", type: "text", defaultValue: "Our commitment to privacy" },
    {
      name: "text",
      type: "longText",
      defaultValue:
        "We ground our privacy commitments in strong data governance practices, so you can trust that we'll protect the privacy and confidentiality of your data and will only use it in a way that's consistent with the reasons you provided it.",
    },
  ],
});

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
