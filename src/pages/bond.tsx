import Head from "next/head";

export default function BondPage() {
  return (
    <main className="w-full">
      <Head>
        <title>Bond — Hector Finance</title>
      </Head>
      <div>
        <h1 className="text-2xl font-semibold">Bond</h1>
        <h2>Swap selected tokens in exchange for HEC</h2>
      </div>
      <div className="mt-24 text-center">
        <h2 className="text-xl">Bonding currently not available</h2>
      </div>
    </main>
  );
}
