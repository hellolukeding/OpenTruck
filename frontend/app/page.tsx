const metrics = [
  { label: "Healthy Nodes", value: "12" },
  { label: "Public Models", value: "38" },
  { label: "Requests Today", value: "84.2k" },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px 72px",
      }}
    >
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          border: "1px solid var(--panel-border)",
          background: "rgba(255, 250, 242, 0.82)",
          backdropFilter: "blur(6px)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(87, 45, 23, 0.12)",
        }}
      >
        <div
          style={{
            padding: "56px 32px 24px",
            borderBottom: "1px solid rgba(216, 200, 181, 0.9)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent-strong)",
            }}
          >
            OpenTruck Control Surface
          </p>
          <h1
            style={{
              margin: "16px 0 12px",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 0.95,
              maxWidth: 760,
            }}
          >
            Route AI traffic across independent nodes with one clean gateway.
          </h1>
          <p
            style={{
              maxWidth: 700,
              margin: 0,
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--muted)",
            }}
          >
            A Next.js admin surface paired with a Python gateway core. Start with
            OpenAI-compatible APIs, then grow into node routing, quotas, and
            operator tooling.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            padding: 24,
          }}
        >
          {metrics.map((metric) => (
            <article
              key={metric.label}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(216, 200, 181, 0.9)",
                background: "linear-gradient(180deg, #fffdf8 0%, #f8efe3 100%)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {metric.label}
              </p>
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {metric.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
