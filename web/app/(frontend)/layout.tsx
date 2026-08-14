import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';

/**
 * Root layout for the public site.
 *
 * The admin has its own root layout in app/(payload)/layout.tsx. Two route
 * groups each carrying a layout, with no app/layout.tsx, is the Payload 3
 * pattern — it keeps the admin's styling out of the public pages entirely.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://amintl.org'),
  title: { default: 'Apostolos Missions International', template: '%s' },
};

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
