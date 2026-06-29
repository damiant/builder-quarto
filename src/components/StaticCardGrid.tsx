type StaticCard = {
  image: string;
  title: string;
  text: string;
};

type StaticCardGridProps = {
  cards: StaticCard[];
};

export function StaticCardGrid({ cards }: StaticCardGridProps) {
  return (
    <div className="static-card-grid static-card-grid-four">
      {cards.map((card) => (
        <article className="static-card" key={card.title}>
          {card.image ? (
            <img loading="lazy" alt={card.title} src={card.image} className="static-card-image" />
          ) : null}
          <div className="static-card-body">
            <h3 className="static-card-title">{card.title}</h3>
            <p className="static-card-text">{card.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
