import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';

/**
 * Root layout for the public site.
 *
 * The admin has its own root layout in app/(payload)/layout.tsx. Two route
 * groups each carrying a layout, with no app/layout.tsx, is the Payload 3
 * pattern — it keeps the admin's styling out of the public pages entirely.
 *
 * globals.css is the same design system as the static site and the
 * WordPress theme (assets/css/main.css) — one set of tokens and components,
 * ported here so the three frontends stay visually identical.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://amintl.org'),
  title: { default: 'Apostolos Missions International', template: '%s' },
};

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
