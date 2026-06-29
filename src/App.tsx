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
import { ContentHeader } from "./components/ContentHeader.tsx";
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

const privacyCommitments = [
  {
    title: "You control your information",
    description:
      "We give you the ability to control your data, along with clear and meaningful choices over how your data is used.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_01_CONTROL_NEW_2000x2000?wid=570&hei=570",
    alt: "A stylized privacy interface with a document, image, comments, likes, and share controls.",
  },
  {
    title: "Your data is protected",
    description:
      "We rigorously protect your data using encryption and other security best practices.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_02_IMAGERY_PROTECTION_NEW_2000x2000?wid=570&hei=570",
    alt: "A group of colorful applications and icons wrapped in transparent ribbon-like structures.",
  },
  {
    title: "You can expect privacy by design",
    description:
      "We design our products with a core commitment to uphold user privacy.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_03_DESIGN_NEW_2000x2000?wid=570&hei=570",
    alt: "Computer interface elements, applications, and files arranged in a privacy-themed graphic.",
  },
  {
    title: "We stand up for your rights",
    description:
      "We support stronger privacy protections and will protect your rights if a lawful request is made for data.",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_04_LAW_NEW%202171x2171?wid=570&hei=570&resSharp=1",
    alt: "An organizer containing documents and other privacy-related user information.",
  },
];

const privacyControls = [
  {
    id: "privacy-dashboard",
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
    id: "privacy-controls",
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
    <main className="test-page quarto-privacy" aria-labelledby="test-page-title" tabIndex={-1}>
      <section className="privacy-hero" aria-labelledby="test-page-title">
        <div className="privacy-section-inner">
          <div className="privacy-heading-block">
            <h1 id="test-page-title" className="privacy-hero-title">
              Privacy at Quarto
            </h1>
            <p className="privacy-hero-subtitle">
              Your data is private at work, at home, and on the go
            </p>
          </div>
          <img
            loading="lazy"
            alt="A collage of graphical user interface elements, including message bubbles, notification panels, and app screens."
            src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_HeroBanner_CROP_4000x1250?scl=1"
            className="privacy-hero-image"
          />
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-commitment-title">
        <div className="privacy-section-inner">
          <ContentHeader
            titleId="privacy-commitment-title"
            title="Our commitment to privacy"
            text="We ground our privacy commitments in strong data governance practices, so you can trust that we'll protect the privacy and confidentiality of your data and will only use it in a way that's consistent with the reasons you provided it."
          />
          <div className="privacy-card-grid privacy-card-grid-four">
            {privacyCommitments.map((item) => (
              <article className="privacy-card" key={item.title}>
                <img loading="lazy" alt={item.alt} src={item.image} className="privacy-card-image" />
                <div className="privacy-card-body">
                  <h3 className="privacy-card-title">{item.title}</h3>
                  <p className="privacy-card-text">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-control-title">
        <div className="privacy-section-inner">
          <ContentHeader
            titleId="privacy-control-title"
            title="Discover and control your data"
            text="Privacy is at the center of how we build the products and services that customers use every day. See privacy resources and controls below where you can manage your data and how it is used."
          />
          <div className="privacy-card-grid privacy-card-grid-three">
            {privacyControls.map((item) => (
              <article id={item.id} className="privacy-card privacy-action-card" key={item.title}>
                <img loading="lazy" alt={item.alt} src={item.image} className="privacy-card-image" />
                <div className="privacy-card-body">
                  <h3 className="privacy-card-title">{item.title}</h3>
                  <p className="privacy-card-text">{item.description}</p>
                </div>
                <div className="privacy-card-footer">
                  <a className="privacy-text-link" href={`#${item.id}`}>
                    {item.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <article className="privacy-business-card">
            <img
              loading="lazy"
              alt="A colorful collection of 3D shapes that depict applications, files, calendar items, and reminder notifications."
              src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_05_BUSINESS_NEW_1920x1440:VP5-800x450"
              className="privacy-business-image"
            />
            <div className="privacy-business-content">
              <h3 className="privacy-feature-title">Data protection for your business</h3>
              <p className="privacy-feature-text">
                For enterprise and business customers, IT admins, or anyone using Quarto products at
                work, visit the Quarto Trust Center to get information about privacy and security
                practices in our products and services.
              </p>
              <a className="privacy-button" href="#privacy-resources-title">
                Quarto Trust Center
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-resources-title">
        <div className="privacy-section-inner">
          <ContentHeader
            titleId="privacy-resources-title"
            title="Learn more about privacy at Quarto"
            text="Learn more about privacy at Quarto and how we put our privacy principles into practice in the following links and resources."
          />
          <h3 className="privacy-resource-kicker">Privacy Statement</h3>
          <div className="privacy-resource-list">
            {privacyResources.map((item) => (
              <article className="privacy-resource-item" key={item.title}>
                <h3 className="privacy-resource-title">
                  <a className="privacy-resource-link" href="#privacy-resources-title">
                    {item.title}
                  </a>
                </h3>
                <p className="privacy-resource-text">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-news-title">
        <div className="privacy-section-inner">
          <ContentHeader
            titleId="privacy-news-title"
            title="What's new?"
            text="Check out the latest articles, blog posts, and news from Quarto about protecting your privacy at home and at work."
          />
          <div className="privacy-card-grid privacy-card-grid-four">
            {privacyNews.map((item) => (
              <article className="privacy-card privacy-news-card" key={item.title}>
                <img loading="lazy" alt={item.alt} src={item.image} className="privacy-card-image" />
                <div className="privacy-card-body">
                  <h3 className="privacy-card-title">{item.title}</h3>
                  <p className="privacy-card-text">{item.description}</p>
                </div>
                <div className="privacy-card-footer">
                  <a className="privacy-text-link" href="#privacy-news-title">
                    Read more
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-privacy" className="privacy-section privacy-contact-section" aria-labelledby="privacy-contact-title">
        <div className="privacy-section-inner">
          <div className="privacy-heading-block">
            <h2 id="privacy-contact-title" className="privacy-section-title">
              Contact our team
            </h2>
            <p className="privacy-section-description">
              If you have a privacy concern, request or question,{" "}
              <a className="privacy-inline-link" href="#contact-privacy">
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
