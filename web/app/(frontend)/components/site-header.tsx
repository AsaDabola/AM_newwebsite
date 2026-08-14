import Link from 'next/link';

/**
 * Header for the HQ site (/intl and below).
 *
 * Deliberately minimal next to the static site's header in
 * tools/site.js — this app only has the HQ home and the About page built
 * so far, so there is no mega menu, drawer or Give button to wire up yet.
 * Add nav items here as their routes land.
 */
export function SiteHeader() {
  return (
    <>
      <div className="utility">
        <div className="container utility__inner">
          <p className="utility__tagline">Apostolos &middot; One who is sent on a mission</p>
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <Link className="logo" href="/intl">
            <span className="logo__text">
              <span className="logo__name">AM</span>
              <span className="logo__sub">International</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main">
            <ul className="nav__list">
              <li className="nav__item">
                <Link className="nav__link" href="/intl/about">
                  Who We Are
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
