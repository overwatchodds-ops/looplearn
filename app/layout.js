export const metadata = {
  title: "LoopLearn",
  description: "Session-based learning system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        <div style={{ padding: 20 }}>
          
          {/* HEADER */}
          <header style={{ marginBottom: 20 }}>
            <h2 style={{ margin: 0 }}>LoopLearn</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
              Learning session loop system
            </p>
          </header>

          {/* MAIN CONTENT */}
          <main>{children}</main>

        </div>
      </body>
    </html>
  );
}
