type StaticCard = {
  image: string;
  title: string;
  text: string;
};

type StaticCardGridProps = {
  cards: StaticCard[];
};

export const staticCardGridBuilderConfig = {
  name: "Static Card Grid",
  inputs: [
    {
      name: "cards",
      type: "list",
      defaultValue: [
        {
          title: "Feature highlight",
          text: "Use this card to highlight an important feature, benefit, or message.",
          image: "",
        },
        {
          title: "Supporting detail",
          text: "Use this card to share additional context for your audience.",
          image: "",
        },
      ],
      subFields: [
        { name: "image", type: "file" },
        { name: "title", type: "text", defaultValue: "Card title" },
        { name: "text", type: "longText", defaultValue: "Card supporting text." },
      ],
    },
  ],
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
