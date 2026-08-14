import type { GlobalConfig } from 'payload';
import { anyone, hqOnly } from '../access';

/**
 * The inherited ninety per cent.
 *
 * Written once by HQ, rendered on all 75 country sites. This is the thing
 * that made WordPress Multisite awkward — there, sixty-eight sites meant
 * sixty-eight copies and a custom plugin to keep them in step. Here it is one
 * record every page reads.
 *
 * Write access is HQ and nobody else. That is what stops sixty-eight editors
 * from being able to change the Statement of Faith.
 */
export const Inherited: GlobalConfig = {
  slug: 'inherited',
  label: 'Shared content',

  admin: {
    group: 'Content',
    description:
      'Edited once, appears on every country site. A country may override a journey step locally, but not this.',
  },

  access: { read: anyone, update: hqOnly },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Journey',
          fields: [
            {
              name: 'journey',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Connect · Grow · Lead · Sent.' },
              fields: [
                { name: 'step', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true, maxLength: 110 },
                { name: 'buttonLabel', type: 'text', maxLength: 22 },
              ],
            },
          ],
        },
        {
          label: 'Beliefs',
          fields: [
            {
              name: 'beliefsIntro',
              type: 'textarea',
              maxLength: 160,
            },
            {
              name: 'articles',
              type: 'array',
              admin: {
                description:
                  'The eleven articles, verbatim. Shortening one changes what AM claims to believe.',
              },
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Pillars',
          fields: [
            {
              name: 'pillars',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'tagline', type: 'text', maxLength: 36 },
            { name: 'address', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'affiliations', type: 'text' },
          ],
        },
      ],
    },
  ],
};
