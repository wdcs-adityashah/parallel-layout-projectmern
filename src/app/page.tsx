import Link from "next/link";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-center min-h-screen p-8 pb-20 gap-3 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome to home page</h1>
      <Link href={'/dashboard'}>Dashboard</Link>
    </div>
  );
}
