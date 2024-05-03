import { DefaultSeoProps } from 'next-seo';

export const SEO: DefaultSeoProps = {
  titleTemplate: "%s | What's That Bird?",
  defaultTitle: "What's That Bird?",
  description: 'Identify Californian birds with the power of AI',
  openGraph: {
    title: "🦆 What's That Bird?",
    description: 'Identify Californian birds with the power of AI',
    images: [{ url: 'https://d2jxjlx1x5gewb.cloudfront.net/cover.png' }],
  },
};
