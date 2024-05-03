// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core';
import type { AppProps } from 'next/app';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import { SEO } from '../../next-seo.config';

const primary: MantineColorsTuple = [
  '#eef4ff',
  '#dfe4f0',
  '#bcc7dd',
  '#97a8ca',
  '#788eba',
  '#657db1',
  '#5a75ad',
  '#4a6399',
  '#40588a',
  '#334c7c',
];

const gray: MantineColorsTuple = [
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
  '#020617',
];

const theme = createTheme({
  colors: {
    primary,
    gray,
  },
  primaryColor: 'primary',
  fontFamily: 'Poppins',
  headings: { fontFamily: 'Rubik' },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#FFF" />
      </Head>
      <DefaultSeo {...SEO} />
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          <Component {...pageProps} />
          <style jsx global>{`
            html,
            body,
            #__next {
              height: 100%;
            }
          `}</style>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
