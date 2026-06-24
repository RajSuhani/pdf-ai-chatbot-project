export default function Message({ data }) {
  return (
    <div className="message-card">

      <div className="msg question">
        <b>🧑 You:</b>
        <p>{data.question}</p>
      </div>

      <div className="msg answer">
        <b>🤖 AI:</b>
        <p>{data.answer}</p>
      </div>

      {data.sources?.length > 0 && (
        <div className="sources-box">
          <b> Sources</b>

          {data.sources.map((s, i) => (
            <div key={i} className="source-item">
              <div>📄 Page {s.page}</div>
              <small>{s.excerpt}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}