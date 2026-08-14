import type { CollectionConfig } from 'payload';
import { anyEditor, anyone, never } from '../access';

/**
 * Everything the public sends: contact, prayer requests, newsletter sign-ups,
 * volunteer and country-intake forms.
 *
 * Nobody edits a submission — it is a record of what someone actually wrote.
 * Prayer requests especially: content-pack/09-contact.md promises they are
 * read by AM staff only and never published, so read access is staff-only and
 * there is no public read at all.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Submission', plural: 'Submissions' },

  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['kind', 'subject', 'country', 'createdAt'],
    group: 'Inbox',
  },

  access: {
    create: anyone, //  public forms post here
    read: anyEditor, //  never public
    update: never,
    delete: never,
  },

  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: ['contact', 'prayer', 'newsletter', 'volunteer', 'intake', 'interest'],
    },
    { name: 'subject', type: 'text' },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      index: true,
      admin: { description: 'Which country page the form was sent from, if any.' },
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'anonymous',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Prayer requests may be submitted anonymously.' },
    },
    { name: 'payload', type: 'json', admin: { description: 'Any extra fields.' } },
  ],
};
