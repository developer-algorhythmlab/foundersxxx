import { useState } from "react";
import { feed as seedFeed, mentors as seedMentors } from "../data/appData";
import { Send, CalendarClock, Megaphone, Check } from "lucide-react";

function SlotDots({ available, total }) {
  return (
    <span style={{ display: "inline-flex", gap: 4 }} aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: i < available ? "var(--good)" : "var(--line-strong)",
          }}
        />
      ))}
    </span>
  );
}

export default function Community({ user }) {
  const [feed, setFeed] = useState(seedFeed);
  const [draft, setDraft] = useState("");
  const [mentors, setMentors] = useState(seedMentors);
  const [justBooked, setJustBooked] = useState(null);

  function post() {
    if (!draft.trim()) return;
    const author = user?.business || user?.name || "You";
    setFeed((f) => [
      { id: Date.now(), author, role: "Founder update", time: "just now", text: draft.trim() },
      ...f,
    ]);
    setDraft("");
  }

  function book(name) {
    setMentors((ms) =>
      ms.map((m) =>
        m.name === name && m.slotsAvailable > 0
          ? { ...m, slotsAvailable: m.slotsAvailable - 1 }
          : m
      )
    );
    setJustBooked(name);
    setTimeout(() => setJustBooked((n) => (n === name ? null : n)), 2000);
  }

  return (
    <div className="grid grid-3 reveal" style={{ gap: 20 }}>
      <div className="span-2" style={{ display: "grid", gap: 20 }}>
        <div className="card pad">
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <Megaphone size={20} color="var(--violet-deep)" />
            <h3 className="section-title" style={{ margin: 0 }}>FoundrFeed</h3>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share an update, ask the community, or post an opportunity…"
              rows={2}
              style={{ flex: 1, resize: "vertical", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line-strong)", fontFamily: "inherit", fontSize: "0.9rem", outline: "none" }}
            />
            <button className="btn btn-primary" onClick={post} style={{ alignSelf: "flex-end" }}>
              <Send size={16} /> Post
            </button>
          </div>
        </div>

        {feed.length === 0 && (
          <div className="card pad" style={{ textAlign: "center" }}>
            <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
              No updates yet — be the first to post.
            </p>
          </div>
        )}

        {feed.map((p) => (
          <div key={p.id} className="card pad">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--grad-brand)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {p.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)" }}>{p.author}</div>
                <div className="muted" style={{ fontSize: "0.75rem" }}>{p.role} • {p.time}</div>
              </div>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink)" }}>{p.text}</p>
          </div>
        ))}
      </div>

      {/* Advisory */}
      <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
        <div className="card pad">
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <CalendarClock size={20} color="var(--violet-deep)" />
            <h3 className="section-title" style={{ margin: 0 }}>Book an advisor</h3>
          </div>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 0 }}>
            Request time with an assigned mentor. Slots refresh weekly.
          </p>
          <div style={{ display: "grid", gap: 12, marginTop: 6 }}>
            {mentors.length === 0 && (
              <p className="muted" style={{ fontSize: "0.82rem", margin: 0 }}>
                No mentors assigned yet.
              </p>
            )}
            {mentors.map((m) => {
              const full = m.slotsAvailable === 0;
              const booked = justBooked === m.name;
              return (
                <div key={m.name} style={{ padding: 14, borderRadius: 14, border: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)" }}>{m.name}</div>
                  <div className="muted" style={{ fontSize: "0.78rem", margin: "2px 0 10px" }}>{m.focus}</div>

                  {/* Slot availability indicator */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <SlotDots available={m.slotsAvailable} total={m.slotsTotal} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: full ? "var(--bad)" : "var(--good)" }}>
                        {full ? "Fully booked" : `${m.slotsAvailable} of ${m.slotsTotal} slots`}
                      </span>
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--violet-deep)", fontWeight: 600 }}>
                      Next: {m.next}
                    </span>
                    <button
                      className={full ? "btn btn-ghost" : "btn btn-primary"}
                      style={{ padding: "7px 14px", fontSize: "0.8rem", opacity: full ? 0.55 : 1, cursor: full ? "not-allowed" : "pointer" }}
                      disabled={full}
                      onClick={() => book(m.name)}
                    >
                      {booked ? (<><Check size={14} /> Requested</>) : full ? "Waitlist" : "Request"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card pad" style={{ background: "var(--panel-tint)", border: "1px solid var(--line-strong)" }}>
          <p className="eyebrow">B2B Marketplace</p>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: "8px 0 12px", color: "var(--ink)" }}>
            Trade services and procure from other SMMEs on the platform.
          </p>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Browse directory
          </button>
        </div>
      </div>
    </div>
  );
}
