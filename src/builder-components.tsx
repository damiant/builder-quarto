import { Builder } from "@builder.io/react";
import { FeaturedProducts } from "./components/FeaturedProducts.tsx";
import { ProductCard } from "./components/ProductCard.tsx";
import { ContentHeader } from "./components/ContentHeader.tsx";
import { PageHero } from "./components/PageHero.tsx";
import { StaticCardGrid } from "./components/StaticCardGrid.tsx";

Builder.registerComponent(PageHero, {
  name: "PageHero",
  inputs: [
    { name: "title", type: "text", defaultValue: "Privacy at Quarto" },
    {
      name: "text",
      type: "longText",
      defaultValue: "Your data is private at work, at home, and on the go",
    },
    {
      name: "image",
      type: "file",
      defaultValue:
        "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_HeroBanner_CROP_4000x1250?scl=1",
    },
  ],
});

Builder.registerComponent(StaticCardGrid, {
  name: "StaticCardGrid",
  inputs: [
    {
      name: "cards",
      type: "list",
      defaultValue: [
        {
          title: "You control your information",
          text: "We give you the ability to control your data, along with clear and meaningful choices over how your data is used.",
          image:
            "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_01_CONTROL_NEW_2000x2000?wid=570&hei=570",
        },
        {
          title: "Your data is protected",
          text: "We rigorously protect your data using encryption and other security best practices.",
          image:
            "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_02_IMAGERY_PROTECTION_NEW_2000x2000?wid=570&hei=570",
        },
      ],
      subFields: [
        { name: "image", type: "file" },
        { name: "title", type: "text", defaultValue: "Card title" },
        { name: "text", type: "longText", defaultValue: "Card supporting text." },
      ],
    },
  ],
});

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
