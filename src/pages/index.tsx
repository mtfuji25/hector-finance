import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <main className="w-full">
      <Head>
        <title>DashBoard — Hector Finance</title>
      </Head>
      <div className=" text-center">
        <h2 className="text-xl">Dashboard</h2>
      </div>
    </main>
  );
}
