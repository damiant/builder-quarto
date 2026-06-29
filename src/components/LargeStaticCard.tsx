type LargeStaticCardProps = {
  image: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaLink: string;
};

export const largeStaticCardBuilderConfig = {
  name: "LargeStaticCard",
  inputs: [
    {
      name: "image",
      type: "file",
      defaultValue:
        "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_05_BUSINESS_NEW_1920x1440:VP5-800x450",
    },
    { name: "title", type: "text", defaultValue: "Data protection for your business" },
    {
      name: "text",
      type: "longText",
      defaultValue:
        "For enterprise and business customers, IT admins, or anyone using Quarto products at work, visit the Quarto Trust Center to get information about privacy and security practices in our products and services.",
    },
    { name: "ctaLabel", type: "text", defaultValue: "Quarto Trust Center" },
    { name: "ctaLink", type: "url", defaultValue: "#static-resources-title" },
  ],
};

export function LargeStaticCard({ image, title, text, ctaLabel, ctaLink }: LargeStaticCardProps) {
  return (
    <article className="static-business-card">
      {image ? (
        <img loading="lazy" alt={title} src={image} className="static-business-image" />
      ) : null}
      <div className="static-business-content">
        <h3 className="static-feature-title">{title}</h3>
        <p className="static-feature-text">{text}</p>
        {ctaLabel ? (
          <a className="static-link-btn" href={ctaLink}>
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
