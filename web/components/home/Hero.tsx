import Link from 'next/link';
import styles from './Hero.module.css';

/**
 * The homepage hero, from the Figma file's Main_2 frame
 * (node 230:2831, https://figma.com/design/5AhK3Mov8IsLeBnLSJ3o9f).
 *
 * Figma-sourced only — the old static site's design and copy are explicitly
 * not used as a fallback here, per direction. Where something below isn't
 * confirmed from Figma, it is marked as such rather than filled in from the
 * legacy site or invented.
 *
 * PROVISIONAL — built without live get_design_context access (the Figma
 * connector is connected at the account level but has not become reachable
 * inside this conversation across repeated checks). Specifically:
 *
 *   CONFIRMED, visible directly in the Main_2 thumbnail screenshot:
 *     - Headline: "Future Begins from Where We Are."
 *     - Layout: full-bleed photo, dark gradient from the bottom, headline
 *       and actions sitting in that gradient, one visible button
 *
 *   CARRIED OVER, pulled from the sibling "Main" frame (node 1:7) before the
 *   user confirmed Main_2 as current — plausible given the two frames'
 *   thumbnails otherwise match, but NOT independently verified on Main_2:
 *     - Eyebrow: "Apostolos — one who is sent"
 *     - Two buttons: "Join our Bible Study" and "Who we are"
 *     - A horizontal divider above the eyebrow
 *
 *   NOT AVAILABLE AT ALL, needs a real pull — and NOT backfilled from the
 *   old site:
 *     - The hero photograph itself (a labelled placeholder stands in below;
 *       see the design-to-code skill's rule against faking an asset)
 *     - Colors, spacing, type sizes and fonts — Hero.module.css uses plain
 *       values or browser defaults, not the old site's token system
 *     - Button hrefs — guessed at /connect and /about pending real ones
 *
 * Re-implement this component for real the moment Figma access is live:
 * get_design_context on 230:2831, reconcile every point above.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imagePlaceholder} aria-hidden="true">
        <span className={styles.imagePlaceholderLabel}>
          hero photo pending — Figma asset not yet pulled
        </span>
      </div>
      <div className={styles.gradient} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.eyebrowRow}>
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.eyebrow}>Apostolos — one who is sent</p>
        </div>

        <h1 className={styles.headline}>Future Begins from Where We Are.</h1>

        <div className={styles.actions}>
          <Link href="/connect" className={styles.buttonPrimary}>
            Join our Bible Study
          </Link>
          <Link href="/about" className={styles.buttonSecondary}>
            Who we are
          </Link>
        </div>
      </div>
    </section>
  );
}
