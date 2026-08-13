/** @type {import('next').NextConfig} */
const nextConfig = {
  // The HQ site lives at /intl, so the bare domain has to go somewhere.
  // Permanent (308) so search engines move the existing authority on
  // amintl.org/ across rather than splitting it.
  async redirects() {
    return [{ source: '/', destination: '/intl', permanent: true }];
  },
};

export default nextConfig;
