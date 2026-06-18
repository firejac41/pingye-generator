import { useState } from "react";

export default function Home() {
  const [situation, setSituation] = useState("");
  const [target, setTarget] = useState("직장 상사");
  const [style, setStyle] = useState("진지하고 설득력 있게");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!situation.trim()) {
      setError("상황을 입력해주세요!");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/excuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, target, style }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.excuses);
      }
    } catch (e) {
      setError("오류가 발생했어요. 다시 시도해주세요!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>🤥 핑계 생성기</h1>
      <p style={{ color: "#888", marginBottom: 8 }}>그럴듯한 핑계를 AI가 만들어드려요</p>
      <p style={{ color: "#f87171", fontSize: 12, marginBottom: 24, background: "#2a1a1a", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>⚠️ 재미로만 사용해주세요</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#555" }}>어떤 상황이에요?</label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="예: 친구 생일파티 가기 싫어요 / 회의에 늦었어요"
          style={{ width: "100%", padding: 10, fontSize: 14, borderRadius: 8, border: "1px solid #ddd", height: 80, resize: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#555" }}>누구한테?</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 8, border: "1px solid #ddd" }}>
            <option>직장 상사</option>
            <option>친구</option>
            <option>연인</option>
            <option>부모님</option>
            <option>선생님</option>
            <option>거래처</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#555" }}>핑계 스타일</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 8, border: "1px solid #ddd" }}>
            <option>진지하고 설득력 있게</option>
            <option>애절하고 불쌍하게</option>
            <option>쿨하고 담담하게</option>
            <option>유머러스하고 웃기게</option>
          </select>
        </div>
      </div>

      <button onClick={generate} disabled={loading}
        style={{ width: "100%", padding: 12, fontSize: 15, fontWeight: 600, borderRadius: 8, border: "none", background: "#6366f1", color: "white", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "핑계 제조 중..." : "핑계 만들어줘 ✨"}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#fee2e2", color: "#dc2626", fontSize: 14 }}>
          {error}
        </div>
      )}

      {results && (
        <div style={{ marginTop: 24 }}>
          {results.map((e, i) => (
            <div key={i} style={{ marginBottom: 12, padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", background: "#1e1e2e", color: "#ffffff" }}>
              <div style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, marginBottom: 6 }}>핑계 {i + 1} — {e.title}</div>
              <p style={{ fontSize: 14, margin: "0 0 8px", lineHeight: 1.6, color: "#ffffff" }}>{e.text}</p>
              <div style={{ fontSize: 12, color: "#aaa" }}>💡 {e.tip}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}