export function ApiCodePanel() {
  return (
    <div className="w-full lg:w-[500px] xl:w-[600px] bg-[#0E0E0E] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto border-l border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-1 mb-6 border-b border-white/10">
          {["curl", "Python", "Node.js"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-code-md text-[13px] ${
                tab === "curl" ? "text-white border-b-2 border-primary-container" : "text-white/50 hover:text-white"
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="group relative rounded-lg overflow-hidden border border-white/10 mb-8 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-[11px] text-white/40 font-code-md tracking-wider uppercase">Example Request</span>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <span className="material-symbols-outlined text-[18px] text-white/60">content_copy</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto"><code className="font-code-md text-[13px] leading-relaxed text-[#D4D4D4]">
<span className="text-[#569CD6]">curl</span> https://api.opentruck.ai/v1/chat/completions {'\\'}
  -H <span className="text-[#CE9178]">&quot;Content-Type: application/json&quot;</span> {'\\'}
  -H <span className="text-[#CE9178]">&quot;Authorization: Bearer $OPENTRUCK_API_KEY&quot;</span> {'\\'}
  -d <span className="text-[#D4D4D4]">{'{'}</span>
    <span className="text-[#9CDCFE]">&quot;model&quot;</span>: <span className="text-[#CE9178]">&quot;gpt-4o&quot;</span>,
    <span className="text-[#9CDCFE]">&quot;messages&quot;</span>: [
      {'{'}
        <span className="text-[#9CDCFE]">&quot;role&quot;</span>: <span className="text-[#CE9178]">&quot;system&quot;</span>,
        <span className="text-[#9CDCFE]">&quot;content&quot;</span>: <span className="text-[#CE9178]">&quot;You are a helpful assistant.&quot;</span>
      {'}'},
      {'{'}
        <span className="text-[#9CDCFE]">&quot;role&quot;</span>: <span className="text-[#CE9178]">&quot;user&quot;</span>,
        <span className="text-[#9CDCFE]">&quot;content&quot;</span>: <span className="text-[#CE9178]">&quot;Hello!&quot;</span>
      {'}'}
    ]
  <span className="text-[#D4D4D4]">{'}'}</span></code></pre>
        </div>

        <div className="group relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40 font-code-md tracking-wider uppercase">Example Response</span>
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <span className="text-[11px] text-white/40 font-code-md">200 OK</span>
          </div>
          <pre className="p-6 overflow-x-auto"><code className="font-code-md text-[13px] leading-relaxed text-[#D4D4D4]">{'{'}
  <span className="text-[#9CDCFE]">&quot;id&quot;</span>: <span className="text-[#CE9178]">&quot;chatcmpl-123&quot;</span>,
  <span className="text-[#9CDCFE]">&quot;object&quot;</span>: <span className="text-[#CE9178]">&quot;chat.completion&quot;</span>,
  <span className="text-[#9CDCFE]">&quot;created&quot;</span>: <span className="text-[#B5CEA8]">1677652288</span>,
  <span className="text-[#9CDCFE]">&quot;model&quot;</span>: <span className="text-[#CE9178]">&quot;gpt-4o&quot;</span>,
  <span className="text-[#9CDCFE]">&quot;choices&quot;</span>: [{'{'}
    <span className="text-[#9CDCFE]">&quot;index&quot;</span>: <span className="text-[#B5CEA8]">0</span>,
    <span className="text-[#9CDCFE]">&quot;message&quot;</span>: {'{'}
      <span className="text-[#9CDCFE]">&quot;role&quot;</span>: <span className="text-[#CE9178]">&quot;assistant&quot;</span>,
      <span className="text-[#9CDCFE]">&quot;content&quot;</span>: <span className="text-[#CE9178]">&quot;\n\nHello there, how may I help you today?&quot;</span>
    {'}'},
    <span className="text-[#9CDCFE]">&quot;finish_reason&quot;</span>: <span className="text-[#CE9178]">&quot;stop&quot;</span>
  {'}'}],
  <span className="text-[#9CDCFE]">&quot;usage&quot;</span>: {'{'}
    <span className="text-[#9CDCFE]">&quot;prompt_tokens&quot;</span>: <span className="text-[#B5CEA8]">9</span>,
    <span className="text-[#9CDCFE]">&quot;completion_tokens&quot;</span>: <span className="text-[#B5CEA8]">12</span>,
    <span className="text-[#9CDCFE]">&quot;total_tokens&quot;</span>: <span className="text-[#B5CEA8]">21</span>
  {'}'}
{'}'}</code></pre>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary-container">lightbulb</span>
            <h4 className="text-white font-bold text-body-md">Developer Insight</h4>
          </div>
          <p className="text-white/60 text-body-sm leading-relaxed">
            Use streaming to improve perceived performance. Our global infrastructure provides
            sub-100ms first-token latency on most standard models.
          </p>
        </div>
      </div>
    </div>
  );
}
