type PageHeroProps = {
  title: string;
  text: string;
  image: string;
};

export function PageHero({ title, text, image }: PageHeroProps) {
  return (
    <section className="static-hero" aria-labelledby="test-page-title">
      <div className="static-section-inner">
        <div className="static-heading-block">
          <h1 id="test-page-title" className="static-hero-title">
            {title}
          </h1>
          <p className="static-hero-subtitle">{text}</p>
        </div>
        {image ? (
          <img
            loading="lazy"
            alt="A collage of graphical user interface elements, including message bubbles, notification panels, and app screens."
            src={image}
            className="static-hero-image"
          />
        ) : null}
      </div>
    </section>
  );
}
