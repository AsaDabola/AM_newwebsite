import type { CollectionConfig } from 'payload';
import { anyEditor, anyone } from '../access';

/**
 * Uploads. On Vercel the filesystem is read-only at runtime, so this needs a
 * storage adapter — @payloadcms/storage-vercel-blob or storage-s3. Without
 * one, uploads work locally and fail in production.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: anyEditor, update: anyEditor, delete: anyEditor },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'wide', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'What the image shows, for readers who cannot see it.' },
    },
  ],
};
