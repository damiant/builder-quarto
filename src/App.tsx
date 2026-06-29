import { useEffect, useState } from "react";
import { BuilderComponent, builder } from "@builder.io/react";
import {
  BUILDER_PUBLIC_API_KEY,
  BUILDER_PAGE_MODEL,
  isBuilderPreviewRequest,
} from "./builder-page.ts";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { FooterLinks } from "./components/FooterLinks.tsx";
import { FeaturedProducts } from "./components/FeaturedProducts.tsx";
import "./builder-components.tsx";

builder.init(BUILDER_PUBLIC_API_KEY);

type BuilderContent = Record<string, unknown>;

function PageNotFound({ urlPath }: { urlPath: string }) {
  return (
    <main className="builder-page-status" aria-labelledby="builder-page-status-title">
      <p className="builder-page-status-eyebrow">Page not found</p>
      <h1 id="builder-page-status-title" className="builder-page-status-title">
        No Builder page found for {urlPath}
      </h1>
    </main>
  );
}

function PageError() {
  return (
    <main className="builder-page-status" aria-labelledby="builder-page-status-title">
      <p className="builder-page-status-eyebrow">Builder page</p>
      <h1 id="builder-page-status-title" className="builder-page-status-title">
        This page could not be loaded right now.
      </h1>
    </main>
  );
}

function TestPage() {
  return (
    <main className="test-page" aria-labelledby="test-page-title">
      <p className="test-page-eyebrow">Test route</p>
      <h1 id="test-page-title" className="test-page-title">
        Hardcoded test component
      </h1>
      <p className="test-page-description">
        This page is rendered locally for the /test route.
      </p>
    </main>
  );
}

export function App() {
  const urlPath = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const isPreview = isBuilderPreviewRequest(searchParams);
  const isTestRoute = urlPath === "/test";
  const useBuilder = !isTestRoute && (urlPath !== "/" || isPreview);

  const [content, setContent] = useState<BuilderContent | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!useBuilder) return;

    builder
      .get(BUILDER_PAGE_MODEL, { url: urlPath })
      .promise()
      .then((data: BuilderContent | null) => {
        setContent(data ?? null);
        const title = (data as { data?: { title?: string } } | null)?.data?.title;
        if (title) document.title = title;
      })
      .catch(() => setError(true));
  }, [urlPath, useBuilder]);

  function renderMain() {
    if (isTestRoute) return <TestPage />;
    if (!useBuilder) {
      return <FeaturedProducts />;
    }
    if (error) return <PageError />;
    if (content === undefined) return null;
    if (content === null) {
      return urlPath === "/" ? <FeaturedProducts /> : <PageNotFound urlPath={urlPath} />;
    }
    return (
      <main className="builder-page-content">
        <BuilderComponent model={BUILDER_PAGE_MODEL} content={content} />
      </main>
    );
  }

  return (
    <>
      <Header />
      {renderMain()}
      <FooterLinks />
      <Footer />
    </>
  );
}
