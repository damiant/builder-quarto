import { Builder } from "@builder.io/react";
import { FeaturedProducts, featuredProductsBuilderConfig } from "./components/FeaturedProducts.tsx";
import { ProductCard, productCardBuilderConfig } from "./components/ProductCard.tsx";
import { ContentHeader, contentHeaderBuilderConfig } from "./components/ContentHeader.tsx";
import { PageHero, pageHeroBuilderConfig } from "./components/PageHero.tsx";
import { StaticCardGrid, staticCardGridBuilderConfig } from "./components/StaticCardGrid.tsx";
import { LargeStaticCard, largeStaticCardBuilderConfig } from "./components/LargeStaticCard.tsx";

Builder.registerComponent(PageHero, pageHeroBuilderConfig);
Builder.registerComponent(StaticCardGrid, staticCardGridBuilderConfig);
Builder.registerComponent(LargeStaticCard, largeStaticCardBuilderConfig);
Builder.registerComponent(ContentHeader, contentHeaderBuilderConfig);
Builder.registerComponent(FeaturedProducts, featuredProductsBuilderConfig);
Builder.registerComponent(ProductCard, productCardBuilderConfig);
