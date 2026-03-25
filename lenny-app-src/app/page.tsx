import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/lenny" className="text-lenny-cyan text-xl hover:underline">
        כניסה ל-LENNY →
      </Link>
    </div>
  );
}
