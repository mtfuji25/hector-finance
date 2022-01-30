import Head from "next/head";
import Link from "next/link";
import { FC, VFC } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="/fonts/square.css" rel="stylesheet" />
      </Head>
      <nav className="text-lg text-amber-900">
        <div className="flex flex-col gap-4 bg-orange-300">
          <Link href="/">
            <a className="-mx-2.5 -my-1 rounded-lg px-2.5 py-1 hover:bg-orange-50 hover:text-amber-600">
              Dashboard
            </a>
          </Link>
          <Link href="/stake">
            <a>Stake</a>
          </Link>
          <Link href="/wrap">
            <a>Wrap</a>
          </Link>
          <Link href="/bond">
            <a>Bond</a>
          </Link>
          <Link href="/swap">
            <a>Swap</a>
          </Link>
          <Link href="/farm">
            <a>Farm</a>
          </Link>
          <Link href="/investments">
            <a>Investments</a>
          </Link>
          <Link href="/calculator">
            <a>Calculator</a>
          </Link>
        </div>
      </nav>
      <main></main>
    </div>
  );
}
