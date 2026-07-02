import { useEffect, useRef, useState } from "react";

const quartoLogo = (
  <svg
    width="148"
    height="40"
    viewBox="0 0 148 40"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Quarto"
  >
    <rect x="0" y="0" width="17" height="17" rx="3" fill="rgb(0, 93, 171)" />
    <rect x="20" y="0" width="17" height="17" rx="3" fill="rgb(0, 93, 171)" opacity="0.7" />
    <rect x="0" y="20" width="17" height="17" rx="3" fill="rgb(0, 93, 171)" opacity="0.7" />
    <rect x="20" y="20" width="17" height="17" rx="3" fill="rgb(0, 93, 171)" opacity="0.4" />
    <text
      x="46"
      y="28"
      fontSize="22"
      fontWeight="700"
      fill="var(--text-h)"
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="-0.5"
    >
      quarto
    </text>
  </svg>
);

const chevronDown = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.131 8.256a.875.875 0 0 1 1.238 0L12 16.888l8.631-8.632a.875.875 0 1 1 1.238 1.238l-9.243 9.243a.885.885 0 0 1-1.252 0L2.131 9.494a.875.875 0 0 1 0-1.238"
      clipRule="evenodd"
    />
  </svg>
);

const chevronRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.256 21.869a.875.875 0 0 1 0-1.238L16.888 12 8.256 3.369A.875.875 0 1 1 9.494 2.13l9.243 9.243a.885.885 0 0 1 0 1.252l-9.243 9.243a.875.875 0 0 1-1.238 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const hamburgerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.555 6.259h18.89a.634.634 0 0 0 0-1.259H2.555a.634.634 0 0 0 0 1.259m18.89 6.736H2.555a.634.634 0 0 1 0-1.258h18.89a.634.634 0 0 1 0 1.258m0 6.727H2.555a.634.634 0 0 1 0-1.259h18.89a.634.634 0 0 1 0 1.259"
      clipRule="evenodd"
    />
  </svg>
);

const searchIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M13.138 2c-4.152 0-7.53 3.203-7.53 7.138 0 2.168 1.028 4.109 2.642 5.419l-4.652 6.14a.443.443 0 0 0 .09.642l.855.582a.5.5 0 0 0 .67-.125l4.708-6.214c.977.44 2.065.694 3.217.694 4.152 0 7.529-3.202 7.529-7.138S17.289 2 13.137 2m0 12.572c-3.16 0-5.732-2.437-5.732-5.434 0-2.996 2.571-5.433 5.732-5.433s5.731 2.437 5.731 5.433-2.57 5.434-5.731 5.434"
      clipRule="evenodd"
    />
  </svg>
);

const cartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m6.005 5.784 14.734.002c.645 0 .887.26.7.968l-1.572 6.688a.54.54 0 0 1-.54.464H7.93l.308 1.392a.78.78 0 0 0 .789.619h9.627c.28 0 .52.243.52.542a.54.54 0 0 1-.538.541H8.932c-.793-.03-1.658-.72-1.772-1.624l-.462-2.011-2.31-9.282H2.54A.54.54 0 0 1 2.539 3h2.31c.285 0 .47.149.54.386zM11 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
      clipRule="evenodd"
    />
  </svg>
);

const locationIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.144 2C8.197 2 5 5.19 5 9.124a7.07 7.07 0 0 0 1.42 4.263L11 21.302q.039.078.087.149l.01.017.002-.001a1.285 1.285 0 0 0 2.022.078l.012.007.044-.078q.104-.134.17-.291l4.489-7.756a7.08 7.08 0 0 0 1.45-4.302C19.287 5.19 16.09 2 12.144 2m-.071 10.736a3.515 3.515 0 0 1-3.52-3.51 3.516 3.516 0 0 1 3.52-3.511 3.515 3.515 0 0 1 3.52 3.51 3.514 3.514 0 0 1-3.52 3.511"
      clipRule="evenodd"
    />
  </svg>
);

type HeaderProps = {
  cartItemCount: number;
  onCartOpen: () => void;
};

const categories = [
  "Guides",
  "Reference",
  "Extensions",
  "Computations",
  "Publishing",
  "Authoring",
  "Projects",
  "Presentations",
  "Dashboards",
  "Websites",
  "Books",
  "Manuscripts",
  "Interactivity",
  "Formats",
  "Tools",
  "FAQ",
];

export function Header({ cartItemCount, onCartOpen }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgeAnimating, setBadgeAnimating] = useState(false);
  const previousCartItemCount = useRef(cartItemCount);
  const badgeClassName = `cart-badge${badgeAnimating ? " cart-badge-animate" : ""}`;

  useEffect(() => {
    if (cartItemCount > previousCartItemCount.current) {
      setBadgeAnimating(false);
      const startAnimation = window.setTimeout(() => setBadgeAnimating(true), 0);
      const stopAnimation = window.setTimeout(() => setBadgeAnimating(false), 700);
      previousCartItemCount.current = cartItemCount;
      return () => {
        window.clearTimeout(startAnimation);
        window.clearTimeout(stopAnimation);
      };
    }

    previousCartItemCount.current = cartItemCount;
  }, [cartItemCount]);

  function closeMenu() {
    setMenuOpen(false);
  }
  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  return (
    <header className="site-header header-sans">
      <div className="utility-bar">
        <div className="utility-bar-inner">
          <nav aria-label="Quick links" className="utility-nav">
            <ul className="utility-links">
              <li>
                <a href="#" className="utility-link">
                  What's New
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Extensions
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Get Started
                </a>
              </li>
              <li>
                <a href="#" className="utility-link">
                  Support
                </a>
              </li>
              <li className="utility-region">
                <button type="button" className="region-btn" aria-label="Language: English">
                  EN {chevronDown}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="main-header-row">
        <a href="/" className="logo-link" aria-label="Quarto home">
          {quartoLogo}
        </a>

        <div className="browse-area">
          <button
            type="button"
            className="browse-btn"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            {hamburgerIcon}
            <span className="browse-label">Browse</span>
          </button>
          <div className={`category-dropdown${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat} className="category-item">
                  <button type="button" className="category-item-btn">
                    {cat} {chevronRight}
                  </button>
                </li>
              ))}
              <li className="category-divider" role="separator"></li>
              <li className="category-item">
                <button type="button" className="category-item-btn category-sign-in">
                  Sign In / Register
                </button>
              </li>
            </ul>
            <div className="close-menu-area">
              <button type="button" className="close-menu-btn" onClick={closeMenu}>
                Close Menu
              </button>
            </div>
          </div>
          <div
            className={`dropdown-overlay${menuOpen ? " open" : ""}`}
            aria-hidden={!menuOpen}
            onClick={closeMenu}
          />
        </div>

        <div className="search-area">
          <div className="search-field">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search Quarto"
                aria-label="Search Quarto"
                className="search-input"
                autoComplete="off"
              />
            </div>
            <div className="search-btn-wrapper">
              <button type="button" aria-label="Search" className="search-btn">
                {searchIcon}
              </button>
            </div>
            <fieldset aria-hidden="true" className="search-fieldset">
              <legend className="search-legend">
                <span>&#8203;</span>
              </legend>
            </fieldset>
          </div>
        </div>

        <nav aria-label="User actions" className="user-actions-nav">
          <ul className="user-actions-list">
            <li className="user-action-item">
              <button type="button" className="sign-in-btn">
                Sign In / Register
              </button>
            </li>
            <li className="user-action-item user-action-divider">
              <a href="#" className="user-action-link">
                Orders &amp; Returns
              </a>
            </li>
            <li className="user-action-item user-action-divider">
              <button
                type="button"
                className="cart-link cart-button"
                aria-label="Open cart"
                onClick={onCartOpen}
              >
                <span className="cart-icon-wrap">
                  {cartIcon}
                  {cartItemCount > 0 && <span className={badgeClassName}>{cartItemCount}</span>}
                </span>
                <span className="cart-label">Cart</span>
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="Shopping tools" className="tools-nav">
          <ul className="tools-list">
            <li className="tools-item">
              <a href="#" className="tool-link">
                {locationIcon}
                <span>Locations</span>
              </a>
            </li>
            <li className="tools-item tools-item-divider">
              <button type="button" className="sign-in-btn">
                Sign In / Register
              </button>
            </li>
            <li className="tools-item tools-item-divider">
              <button
                type="button"
                className="cart-link cart-button"
                aria-label="Open cart"
                onClick={onCartOpen}
              >
                <span className="cart-icon-wrap">
                  {cartIcon}
                  {cartItemCount > 0 && <span className={badgeClassName}>{cartItemCount}</span>}
                </span>
                <span className="cart-label">Cart</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
