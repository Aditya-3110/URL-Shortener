import { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://url-shortener-xkmx.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [clicks, setClicks] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });
      const data = await res.json();

      if (!res.ok || !data.shortUrl) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);

      const shortId = data.shortUrl.split("/").pop();
      const statsRes = await fetch(`${API_BASE_URL}/stats/${shortId}`);
      const statsData = await statsRes.json();
      setClicks(statsData.clicks);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!shortUrl) return;
    const shortId = shortUrl.split("/").pop();
    try {
      const res = await fetch(`${API_BASE_URL}/stats/${shortId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      setClicks(data.clicks);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />
      <div style={styles.dots} />

      {/* Main content */}
      <div style={styles.content}>
        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Free to use — no sign up needed
        </div>

        {/* Heading */}
        <h1 style={styles.title}>
          Shorten links.<br />
          <span style={{ color: "#AFA9EC" }}>Track everything.</span>
        </h1>
        <p style={styles.desc}>
          Paste any long URL and get a clean, shareable short link in seconds.
          Monitor clicks in real time.
        </p>

        {/* Card */}
        <div style={styles.card}>
          <label style={styles.inputLabel}>Your long URL</label>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="https://example.com/your/very/long/url/here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={handleShorten}
              disabled={loading}
              style={{ ...styles.btnShorten, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "..." : "Shorten"}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {shortUrl && (
            <>
              <div style={styles.divider} />

              {/* Stats */}
              <div style={styles.statGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Total clicks</div>
                  <div style={styles.statValue}>{clicks ?? 0}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Status</div>
                  <div style={{ ...styles.statValue, fontSize: "14px", color: "#5DCAA5", paddingTop: "2px" }}>
                    Active
                  </div>
                </div>
              </div>

              {/* Short link */}
              <div style={styles.shortLinkLabel}>Your short link</div>
              <div style={styles.shortLinkBox}>
                <span
                  onClick={() => window.open(shortUrl, "_blank", "noopener,noreferrer")}
                  style={{ ...styles.shortLink, cursor: "pointer" }}
                >
                  {shortUrl}
                </span>
                <button
                  onClick={copyToClipboard}
                  style={copied ? { ...styles.btnSm, ...styles.btnSmSuccess } : styles.btnSm}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={fetchStats} style={styles.btnSm}>
                  Refresh
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer features */}
      <div style={styles.features}>
        {["Instant shortening", "Click analytics", "One-click copy"].map((f) => (
          <div key={f} style={styles.feat}>
            <span style={styles.featDot} />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#0f0c29",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", width: "420px", height: "420px",
    background: "#534AB7", borderRadius: "50%",
    top: "-100px", left: "-80px",
    filter: "blur(120px)", opacity: 0.45,
  },
  blob2: {
    position: "absolute", width: "380px", height: "380px",
    background: "#0F6E56", borderRadius: "50%",
    bottom: "-80px", right: "-60px",
    filter: "blur(110px)", opacity: 0.4,
  },
  blob3: {
    position: "absolute", width: "250px", height: "250px",
    background: "#D4537E", borderRadius: "50%",
    top: "40%", left: "60%",
    filter: "blur(100px)", opacity: 0.2,
  },
  dots: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  },
  content: {
    position: "relative", zIndex: 2,
    width: "100%", maxWidth: "540px",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "999px", padding: "5px 14px",
    fontSize: "12px", color: "rgba(255,255,255,0.7)",
    marginBottom: "1.5rem",
  },
  badgeDot: {
    width: "6px", height: "6px",
    borderRadius: "50%", background: "#5DCAA5",
    display: "inline-block",
  },
  title: {
    fontSize: "38px", fontWeight: "700", color: "#fff",
    letterSpacing: "-1px", lineHeight: "1.15",
    marginBottom: "0.75rem",
  },
  desc: {
    fontSize: "15px", color: "rgba(255,255,255,0.55)",
    marginBottom: "2.5rem", lineHeight: "1.6",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px", padding: "2rem",
  },
  inputLabel: {
    display: "block", fontSize: "12px", fontWeight: "500",
    color: "rgba(255,255,255,0.45)", textAlign: "left",
    marginBottom: "8px", letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  inputRow: { display: "flex", gap: "10px" },
  error: {
    color: "#FFB4B4",
    fontSize: "13px",
    marginTop: "10px",
    textAlign: "left",
  },
  input: {
    flex: 1, padding: "12px 16px", fontSize: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff", outline: "none",
  },
  btnShorten: {
    padding: "12px 22px", fontSize: "14px", fontWeight: "600",
    border: "none", borderRadius: "12px",
    background: "#7F77DD", color: "#fff",
    cursor: "pointer", whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "1.5rem 0",
  },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" },
  statCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", padding: "14px 16px", textAlign: "left",
  },
  statLabel: {
    fontSize: "11px", color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "5px",
  },
  statValue: { fontSize: "24px", fontWeight: "600", color: "#fff" },
  shortLinkLabel: {
    fontSize: "11px", color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase", letterSpacing: "0.5px",
    marginBottom: "6px", textAlign: "left",
  },
  shortLinkBox: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", padding: "12px 16px",
  },
  shortLink: {
    flex: 1, fontSize: "14px", color: "#AFA9EC",
    textDecoration: "none", overflow: "hidden",
    textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  btnSm: {
    padding: "7px 14px", fontSize: "13px", fontWeight: "500",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.8)",
    borderRadius: "9px", cursor: "pointer", whiteSpace: "nowrap",
  },
  btnSmSuccess: {
    borderColor: "rgba(93,202,165,0.4)",
    color: "#5DCAA5",
  },
  features: {
    position: "relative", zIndex: 2,
    display: "flex", justifyContent: "center",
    gap: "2rem", marginTop: "2rem",
  },
  feat: {
    display: "flex", alignItems: "center",
    gap: "6px", fontSize: "13px",
    color: "rgba(255,255,255,0.45)",
  },
  featDot: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "rgba(175,169,236,0.6)",
    display: "inline-block",
  },
};

export default App;
