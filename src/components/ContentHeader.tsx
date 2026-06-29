type ContentHeaderProps = {
  title: string;
  text: string;
  titleId?: string;
};

export function ContentHeader({ title, text, titleId }: ContentHeaderProps) {
  return (
    <div className="privacy-heading-block">
      <h2 id={titleId} className="privacy-section-title">
        {title}
      </h2>
      <p className="privacy-section-description">{text}</p>
    </div>
  );
}
