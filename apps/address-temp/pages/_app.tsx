import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import 'tailwindcss/tailwind.css';


function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title className="text-indigo-600">Welcome to address-temp!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
