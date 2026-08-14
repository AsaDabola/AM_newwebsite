import type { CollectionConfig } from 'payload';
import { hqOnly } from '../access';

/**
 * Editors. Roughly eighty of them: HQ, eight regional leaders, and one owner
 * per country site.
 *
 * `role` and `country` together drive every access rule in ../access. Only HQ
 * can change them — otherwise a country editor could promote themselves.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'country'],
    group: 'People',
  },

  access: {
    read: hqOnly,
    create: hqOnly,
    update: hqOnly,
    delete: hqOnly,
    admin: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'country',
      options: [
        { label: 'Headquarters — everything', value: 'hq' },
        { label: 'Regional editor — every country in one region', value: 'region' },
        { label: 'Country editor — one country site', value: 'country' },
      ],
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        condition: (data) => data?.role === 'region',
        description: 'Must match the region name on the country rows exactly.',
      },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      admin: {
        condition: (data) => data?.role === 'country',
        description: 'The one site this person may edit.',
      },
    },
  ],
};
