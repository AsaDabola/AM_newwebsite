import type { ReactNode } from 'react';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import config from '@payload-config';
import { importMap } from './admin/importMap';

import '@payloadcms/next/css';

/**
 * Root layout for the admin, entirely separate from the public site's layout
 * in app/(frontend)/layout.tsx. Payload owns everything under /admin.
 */

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
