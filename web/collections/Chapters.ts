import type { CollectionConfig } from 'payload';
import { ownedByCountry, publishedOrEditor } from '../access';
import { revalidateChapterCountry } from '../hooks/revalidateCountry';

/**
 * A chapter belongs to exactly one country site. Access is scoped through
 * that relationship, so a country editor sees only their own chapters.
 *
 * Seeded with the 52 chapters already published on amintl.org. The fields
 * that matter most — university, meeting time, contact — are the ones AM
 * still has to collect (content-pack/12-gaps.md, item B5).
 */
export const Chapters: CollectionConfig = {
  slug: 'chapters',
  labels: { singular: 'Chapter', plural: 'Chapters' },

  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'country', 'university', 'email'],
    group: 'Sites',
  },

  access: {
    read: publishedOrEditor,
    create: ownedByCountry,
    update: ownedByCountry,
    delete: ownedByCountry,
  },

  hooks: { afterChange: [revalidateChapterCountry] },

  fields: [
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
      admin: { description: 'The country site this chapter appears on.' },
    },
    { name: 'city', type: 'text', required: true },
    {
      name: 'university',
      type: 'text',
      admin: { description: 'The campus this chapter serves.' },
    },
    { name: 'meetingDay', type: 'text', admin: { description: 'e.g. Friday' } },
    { name: 'meetingTime', type: 'text', admin: { description: 'e.g. 7pm' } },
    {
      name: 'email',
      type: 'email',
      admin: {
        description:
          'How a student reaches this chapter. Without it the finder cannot do its job.',
      },
    },
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
