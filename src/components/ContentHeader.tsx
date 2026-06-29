type ContentHeaderProps = {
  title: string;
  text: string;
  titleId?: string;
};

export function ContentHeader({ title, text, titleId }: ContentHeaderProps) {
  return (
    <div className="static-heading-block">
      <h2 id={titleId} className="static-section-title">
        {title}
      </h2>
      <p className="static-section-description">{text}</p>
    </div>
  );
}
