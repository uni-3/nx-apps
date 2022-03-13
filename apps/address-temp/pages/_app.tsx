import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import 'tailwindcss/tailwind.css';


function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title className="text-indigo-600">住所フォーム!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
