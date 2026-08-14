import Link from 'next/link';

/**
 * Footer for the HQ site (/intl and below).
 *
 * Kept to links that actually resolve today (Home, Who we are) rather than
 * reproducing the static site's full four-column footer, which would mean
 * linking to pages (What We Do, Get Involved, Network, Give, ...) that do
 * not exist in this app yet.
 */
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link className="logo" href="/intl">
              <span className="logo__text">
                <span className="logo__name">AM</span>
                <span className="logo__sub">International</span>
              </span>
            </Link>
            <p>
              An interdenominational ministry committed to spreading the gospel to the ends of
              the earth, testifying to the eternal love of the Lord.
            </p>
            <p>
              Apostolos Missions International
              <br />
              Trenton, New Jersey, USA
              <br />
              <a href="mailto:info@amintl.org">info@amintl.org</a>
            </p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} Apostolos Missions International. All rights
            reserved.
          </p>
          <ul className="footer__legal">
            <li>
              <Link href="/intl/about">Who we are</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
