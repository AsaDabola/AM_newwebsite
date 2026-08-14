import type { CollectionConfig } from 'payload';
import { countryScoped, never, publishedOrEditor, hqOnlyField } from '../access';
import { revalidateCountry } from '../hooks/revalidateCountry';

/**
 * One row per *site* — 68 of them, not one per country. Grouped entries such
 * as East Federal Africa are a single editable record answering six URLs.
 *
 * The identity fields at the top come from the mission country list and are
 * read-only to everyone but HQ. Everything below "Local content" is the ten
 * per cent a country team writes; the other ninety per cent is inherited from
 * the `inherited` global and is not editable here at all.
 */
export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: { singular: 'Country site', plural: 'Country sites' },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'status', 'owner'],
    group: 'Sites',
    description:
      'Each row is one country site. Fill in the local fields; everything else is inherited from the global content.',
  },

  access: {
    read: publishedOrEditor,
    update: countryScoped,
    // Countries are seeded from tools/content/countries.js, never hand-made.
    create: never,
    delete: never,
  },

  hooks: {
    afterChange: [revalidateCountry],
  },

  fields: [
    /* ---- identity: from the mission country list ------------------------ */
    {
      type: 'collapsible',
      label: 'Identity',
      admin: {
        description: 'From the mission country list. Only HQ can change these.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'entryNo',
          type: 'number',
          required: true,
          unique: true,
          index: true,
          access: { update: hqOnlyField },
          admin: { description: 'Row number in the mission country list.' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          access: { update: hqOnlyField },
        },
        {
          name: 'region',
          type: 'text',
          required: true,
          index: true,
          access: { update: hqOnlyField },
        },
        {
          name: 'tier',
          type: 'select',
          options: ['G20', 'M40', 'Additional'],
          access: { update: hqOnlyField },
        },
        {
          name: 'paths',
          type: 'array',
          access: { update: hqOnlyField },
          admin: {
            description:
              'The URLs this site answers to. Generated — edit tools/content/countries.js instead.',
          },
          fields: [{ name: 'path', type: 'text', required: true }],
        },
        {
          name: 'covers',
          type: 'array',
          access: { update: hqOnlyField },
          admin: { description: 'For grouped sites: the countries served.' },
          fields: [{ name: 'country', type: 'text', required: true }],
        },
      ],
    },

    /* ---- publication ---------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft — not visible to the public', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      access: { update: hqOnlyField },
      admin: {
        position: 'sidebar',
        description:
          'HQ publishes a country once its required fields are filled in.',
      },
    },
    {
      name: 'owner',
      type: 'text',
      access: { update: hqOnlyField },
      admin: {
        position: 'sidebar',
        description: 'The named person responsible for this site.',
      },
    },

    /* ---- local content: the ten per cent -------------------------------- */
    {
      name: 'standfirst',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description:
          'One sentence about the work here, max 160 characters. Left blank, the page uses the shared wording.',
      },
    },
    {
      name: 'locale',
      type: 'text',
      admin: {
        description:
          'Which language this site is written in, e.g. es, pt-BR, sw. Required before publishing.',
      },
    },
    {
      name: 'startedYear',
      type: 'number',
      admin: { description: 'Shown as "Since {year}". Optional.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { description: 'Where enquiries from this country go. Required before publishing.' },
    },
    { name: 'leaderName', type: 'text' },
    { name: 'leaderRole', type: 'text' },
    {
      name: 'photos',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },

    /* ---- overrides of inherited content --------------------------------- */
    {
      name: 'overrides',
      type: 'array',
      admin: {
        description:
          'Optional. Replace a shared section with local wording. Leave empty and the global text is used.',
      },
      fields: [
        {
          name: 'block',
          type: 'select',
          required: true,
          options: ['connect', 'grow', 'lead', 'sent'],
        },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
};
