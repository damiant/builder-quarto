import { type FormEvent, useEffect, useState } from "react";
import { BuilderComponent, builder } from "@builder.io/react";
import {
  BUILDER_PUBLIC_API_KEY,
  BUILDER_PAGE_MODEL,
  isBuilderPreviewRequest,
} from "./builder-page.ts";
import {
  getStoredAccountEmail,
  signInAccount,
  signOutAccount,
  subscribeToAccountChanges,
} from "./components/account.ts";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { FooterLinks } from "./components/FooterLinks.tsx";
import { FeaturedProducts, getCategorySlug } from "./components/FeaturedProducts.tsx";
import { ContentHeader } from "./components/ContentHeader.tsx";
import { PageHero } from "./components/PageHero.tsx";
import { StaticCardGrid } from "./components/StaticCardGrid.tsx";
import { LargeStaticCard } from "./components/LargeStaticCard.tsx";
import { ProductDetailPage } from "./components/ProductDetailPage.tsx";
import { StoresPage } from "./components/StoresPage.tsx";
import { StoreDetailPage } from "./components/StoreDetailPage.tsx";
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

function AccountPage() {
  const [accountEmail, setAccountEmail] = useState(() => getStoredAccountEmail());
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => subscribeToAccountChanges(() => setAccountEmail(getStoredAccountEmail())), []);

  function handleSignInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signInAccount(emailInput)) return;

    setAccountEmail(getStoredAccountEmail());
    setEmailInput("");
  }

  function handleSignOut() {
    signOutAccount();
    setAccountEmail(null);
  }

  return (
    <main className="account-page" aria-labelledby="account-page-title">
      <p className="account-page-eyebrow">Account</p>
      <h1 id="account-page-title" className="account-page-title">
        Your Quarto account
      </h1>
      {accountEmail ? (
        <section className="account-panel" aria-label="Signed in account details">
          <p className="account-panel-label">Signed in as</p>
          <p className="account-panel-email">{accountEmail}</p>
          <button type="button" className="account-sign-out-btn" onClick={handleSignOut}>
            Sign out
          </button>
        </section>
      ) : (
        <section className="account-panel" aria-label="Sign in or create account">
          <p className="account-panel-label">Sign in or create an account</p>
          <h2 className="account-panel-title">Access your Quarto account</h2>
          <p className="account-panel-text">
            Enter your email to save gadgets, view account details, and continue faster next time.
          </p>
          <form className="account-cta-form" onSubmit={handleSignInSubmit}>
            <label className="account-cta-label" htmlFor="account-email">
              Email address
            </label>
            <div className="account-cta-row">
              <input
                id="account-email"
                className="account-cta-input"
                type="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <button type="submit" className="account-cta-submit">
                Sign in / Sign up
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

function getCategoryLabel(category: string): string {
  return category
    .split("-")
    .filter(Boolean)
    .map((word) =>
      word.length <= 2 ? word.toUpperCase() : `${word[0].toUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
}

const privacyCommitments = [
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
  {
    title: "You can expect privacy by design",
    text: "We design our products with a core commitment to uphold user privacy.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_03_DESIGN_NEW_2000x2000?wid=570&hei=570",
  },
  {
    title: "We stand up for your rights",
    text: "We support stronger privacy protections and will protect your rights if a lawful request is made for data.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_04_LAW_NEW%202171x2171?wid=570&hei=570&resSharp=1",
  },
];

const privacyControls = [
  {
    id: "static-dashboard",
    title: "Visit your privacy dashboard",
    description:
      "The privacy dashboard is where you can manage privacy settings and review data associated with your Quarto account.",
    cta: "Go to your Privacy Dashboard",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/privacy_dashboard_card_809X461?wid=517&hei=291&fit=crop",
    alt: "A stylized document card with text lines and an orange toggle.",
  },
  {
    id: "account-safety",
    title: "Account check-up",
    description:
      "The account check-up wizard helps you review account safety settings and strengthen your online security.",
    cta: "Do an account check-up",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/privacy_account_checkup_card_809X461?wid=517&hei=291&fit=crop",
    alt: "A blue shield with a white checkmark in the center.",
  },
  {
    id: "static-controls",
    title: "Find your privacy controls",
    description:
      "Learn where to find privacy settings and related information in Quarto products and services.",
    cta: "See more privacy controls",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/privacy_controls_card_809X461?wid=517&hei=291&fit=crop",
    alt: "Two green toggles shown in off and on positions.",
  },
];

const privacyResources = [
  {
    title: "Privacy Statement",
    description:
      "Your privacy is important to us. The privacy statement explains the personal data Quarto processes, how Quarto processes it, and for what purposes.",
  },
  {
    title: "Privacy for Young People",
    description:
      "Privacy for young people helps younger users understand Quarto privacy practices and how to use our products in a way that protects their privacy.",
  },
  {
    title: "Privacy Report",
    description:
      "The privacy report includes new developments in privacy at Quarto, including what personal data we collect, how it may be used, and how you can manage it.",
  },
  {
    title: "Privacy Frequently Asked Questions",
    description:
      "Do you have a question about Quarto privacy? We explain how customers can export or delete personal data and more in the Privacy FAQs.",
  },
  {
    title: "Quarto Corporate Responsibility",
    description:
      "Learn more about how Quarto approaches building a more inclusive, equitable, sustainable, and trusted future for everyone.",
  },
  {
    title: "U.S. State Data Privacy Notice",
    description: "If you are in the U.S., please see our U.S. State Data Privacy Notice.",
  },
];

const privacyNews = [
  {
    title: "GDPR and generative AI - a guide for the public sector",
    description:
      "This whitepaper offers practical support for public sector organizations as they consider generative AI services and comply with GDPR obligations.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/GDPR_and_generative_AI_A%20guide_for_the_public_sector?wid=406&hei=230&fit=crop&resSharp=1",
    alt: "Aerial view of an office foyer with people walking across elevated walkways and escalators.",
  },
  {
    title: "Protecting commercial and public sector customer data in the AI era",
    description:
      "Learn more about Quarto's commitment to protecting customer data and building AI experiences on a foundation of privacy.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Protecting_the_data_of_our_commercial_and_public_sector_customers_in_the_AI_era?wid=380&hei=213&fit=crop",
    alt: "An abstract image of colorful shapes.",
  },
  {
    title: "Enhancing trust and protecting privacy in the AI era",
    description:
      "Discover how Quarto's privacy commitments apply to AI and how customers can use new technologies while protecting privacy.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Enhancing_trust_and_protecting_privacy_in_the_AI_era?wid=380&hei=213&fit=crop",
    alt: "An abstract image of a connected network.",
  },
  {
    title: "Quarto Cloud enables customers to keep personal data close to home",
    description:
      "Quarto data boundary controls help customers choose where their information is stored and processed as privacy needs evolve.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/EU-Data-Boundary-Blog-image-1-small?wid=380&hei=213&fit=crop",
    alt: "A map of Europe.",
  },
];

function TestPage() {
  return (
    <main className="test-page quarto-static" aria-labelledby="test-page-title" tabIndex={-1}>
      <PageHero
        title="Privacy at Quarto"
        text="Your data is private at work, at home, and on the go"
        image="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_HeroBanner_CROP_4000x1250?scl=1"
      />

      <section className="static-section" aria-labelledby="static-commitment-title">
        <div className="static-section-inner">
          <ContentHeader
            titleId="static-commitment-title"
            title="Our commitment to privacy"
            text="We ground our privacy commitments in strong data governance practices, so you can trust that we'll protect the privacy and confidentiality of your data and will only use it in a way that's consistent with the reasons you provided it."
          />
          <StaticCardGrid cards={privacyCommitments} />
        </div>
      </section>

      <section className="static-section" aria-labelledby="static-control-title">
        <div className="static-section-inner">
          <ContentHeader
            titleId="static-control-title"
            title="Discover and control your data"
            text="Privacy is at the center of how we build the products and services that customers use every day. See privacy resources and controls below where you can manage your data and how it is used."
          />
          <div className="static-card-grid static-card-grid-three">
            {privacyControls.map((item) => (
              <article id={item.id} className="static-card" key={item.title}>
                <img loading="lazy" alt={item.alt} src={item.image} className="static-card-image" />
                <div className="static-card-body">
                  <h3 className="static-card-title">{item.title}</h3>
                  <p className="static-card-text">{item.description}</p>
                </div>
                <div className="static-card-footer">
                  <a className="static-text-link" href={`#${item.id}`}>
                    {item.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <LargeStaticCard
            image="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_05_BUSINESS_NEW_1920x1440:VP5-800x450"
            title="Data protection for your business"
            text="For enterprise and business customers, IT admins, or anyone using Quarto products at work, visit the Quarto Trust Center to get information about privacy and security practices in our products and services."
            ctaLabel="Quarto Trust Center"
            ctaLink="#static-resources-title"
          />
        </div>
      </section>

      <section className="static-section" aria-labelledby="static-resources-title">
        <div className="static-section-inner">
          <ContentHeader
            titleId="static-resources-title"
            title="Learn more about privacy at Quarto"
            text="Learn more about privacy at Quarto and how we put our privacy principles into practice in the following links and resources."
          />
          <h3 className="static-resource-kicker">Privacy Statement</h3>
          <div className="static-resource-list">
            {privacyResources.map((item) => (
              <article className="static-resource-item" key={item.title}>
                <h3 className="static-resource-title">
                  <a className="static-resource-link" href="#static-resources-title">
                    {item.title}
                  </a>
                </h3>
                <p className="static-resource-text">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="static-section" aria-labelledby="static-news-title">
        <div className="static-section-inner">
          <ContentHeader
            titleId="static-news-title"
            title="What's new?"
            text="Check out the latest articles, blog posts, and news from Quarto about protecting your privacy at home and at work."
          />
          <div className="static-card-grid static-card-grid-four">
            {privacyNews.map((item) => (
              <article className="static-card" key={item.title}>
                <img loading="lazy" alt={item.alt} src={item.image} className="static-card-image" />
                <div className="static-card-body">
                  <h3 className="static-card-title">{item.title}</h3>
                  <p className="static-card-text">{item.description}</p>
                </div>
                <div className="static-card-footer">
                  <a className="static-text-link" href="#static-news-title">
                    Read more
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact-static"
        className="static-section static-contact-section"
        aria-labelledby="static-contact-title"
      >
        <div className="static-section-inner">
          <div className="static-heading-block">
            <h2 id="static-contact-title" className="static-section-title">
              Contact our team
            </h2>
            <p className="static-section-description">
              If you have a privacy concern, request or question,{" "}
              <a className="static-inline-link" href="#contact-static">
                please contact us
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function App() {
  const urlPath = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const isPreview = isBuilderPreviewRequest(searchParams);
  const productId = urlPath.startsWith("/products/")
    ? decodeURIComponent(urlPath.slice("/products/".length))
    : null;
  const categoryId = urlPath.startsWith("/categories/")
    ? getCategorySlug(decodeURIComponent(urlPath.slice("/categories/".length)))
    : null;
  const discoverTag = urlPath.startsWith("/discover/")
    ? getCategorySlug(decodeURIComponent(urlPath.slice("/discover/".length)))
    : null;
  const isTestRoute = urlPath === "/test";
  const isStoresRoute = urlPath === "/stores";
  const storeDetailSlug = urlPath.startsWith("/stores/")
    ? decodeURIComponent(urlPath.slice("/stores/".length))
    : null;
  const useBuilder =
    !isTestRoute &&
    !isStoresRoute &&
    !storeDetailSlug &&
    !productId &&
    !categoryId &&
    (urlPath !== "/" || isPreview);

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
    if (isStoresRoute) return <StoresPage />;
    if (storeDetailSlug) return <StoreDetailPage storeSlug={storeDetailSlug} />;
    if (productId) return <ProductDetailPage productId={productId} />;
    if (categoryId) {
      const categoryLabel = getCategoryLabel(categoryId);
      return (
        <FeaturedProducts
          eyebrow="Category"
          title={`Shop ${categoryLabel}`}
          productCount={12}
          category={categoryId}
        />
      );
    }
    if (discoverTag) {
      const tagLabel = getCategoryLabel(discoverTag);
      return (
        <FeaturedProducts
          eyebrow="Discover"
          title={`Shop ${tagLabel}`}
          productCount={12}
          tag={discoverTag}
        />
      );
    }
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
