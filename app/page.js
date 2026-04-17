import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>LoopLearn</h1>

      <p>Session-based learning system</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/family">
          <button style={{ padding: 10, marginRight: 10 }}>
            Go to Family
          </button>
        </Link>

        <Link href="/people">
          <button style={{ padding: 10 }}>
            Manage People
          </button>
        </Link>
      </div>
    </div>
  );
}
