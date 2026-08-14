import type { CollectionConfig } from 'payload';
import { ownedByCountry, publishedOrEditor } from '../access';

/** Stories from a country. Same country scoping as chapters. */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Story', plural: 'News' },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'publishedAt', 'status'],
    group: 'Content',
  },

  access: {
    read: publishedOrEditor,
    create: ownedByCountry,
    update: ownedByCountry,
    delete: ownedByCountry,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
    },
    { name: 'standfirst', type: 'textarea', maxLength: 200 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'published'],
      admin: { position: 'sidebar' },
    },
  ],
};
