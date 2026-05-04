import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Replace with your actual API base URL
const API_BASE = "https://notes-backend-mjcb.onrender.com/";

async function fetchNotes() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch notes");
  const data = await res.json();
  return data.GetAllNotes; // ← extract the array
}
async function createNote(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create note");
  const json = await res.json();
  return json.note; // ← extract note
}

async function updateNote(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update note");
  const json = await res.json();
  return json.note; // ← extract note
}

async function deleteNote(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Mono', monospace;
    background: #f5f0e8;
    min-height: 100vh;
  }

  .app {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px 60px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 36px;
  }
  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  .header .count {
    font-size: 0.75rem;
    color: #888;
    background: #e2dcd0;
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* Form */
  .form-card {
    background: #fff;
    border: 1.5px solid #e0d8cc;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 28px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #888;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .form-card input,
  .form-card textarea {
    width: 100%;
    background: #faf8f4;
    border: 1.5px solid #e0d8cc;
    border-radius: 8px;
    padding: 10px 12px;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
  }
  .form-card input { margin-bottom: 10px; }
  .form-card textarea { min-height: 80px; }
  .form-card input:focus,
  .form-card textarea:focus { border-color: #c9a96e; }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }

  /* Buttons */
  .btn {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-primary {
    background: #1a1a1a;
    color: #f5f0e8;
  }
  .btn-primary:hover { background: #333; }
  .btn-secondary {
    background: #e2dcd0;
    color: #555;
  }
  .btn-secondary:hover { background: #d5cfc4; }
  .btn-danger {
    background: transparent;
    color: #c0392b;
    padding: 4px 8px;
    font-size: 0.75rem;
    border: 1px solid #f0c0bb;
    border-radius: 6px;
  }
  .btn-danger:hover { background: #fdf0ef; }
  .btn-edit {
    background: transparent;
    color: #888;
    padding: 4px 8px;
    font-size: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  .btn-edit:hover { color: #333; border-color: #bbb; }

  /* Notes grid */
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .note-card {
    background: #fff;
    border: 1.5px solid #e0d8cc;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: box-shadow 0.2s;
    animation: fadeIn 0.25s ease;
  }
  .note-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  .note-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    word-break: break-word;
  }
  .note-card p {
    font-size: 0.82rem;
    color: #666;
    line-height: 1.55;
    flex: 1;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .note-meta {
    font-size: 0.7rem;
    color: #bbb;
  }
  .note-actions {
    display: flex;
    gap: 6px;
    margin-top: 4px;
  }

  /* Error / Empty */
  .error-msg {
    background: #fdf0ef;
    border: 1px solid #f0c0bb;
    color: #c0392b;
    font-size: 0.8rem;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .empty {
    text-align: center;
    color: #bbb;
    font-size: 0.85rem;
    padding: 48px 0;
    grid-column: 1 / -1;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
  try {
    const data = await fetchNotes();  // ← call YOUR fetchNotes function
    setNotes(data);
  } catch {
    setError("Could not load notes. Is your backend running?");
  }
}


  function clearForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
    setError("");
  }

  function startEdit(note) {
    setEditingId(note._id || note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
  if (!title.trim()) { setError("Title is required."); return; }
  setLoading(true);
  setError("");
  try {
    if (editingId) {
      await updateNote(editingId, { title, content });
    } else {
      await createNote({ title, content });
    }
    await loadNotes(); // ← just reload everything from DB
    clearForm();
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}

async function handleDelete(id) {
  if (!confirm("Delete this note?")) return;
  try {
    await deleteNote(id);
    await loadNotes();
  } catch {
    setError("Could not delete note.");
  }
}
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>Notes</h1>
          <span className="count">{notes.length} total</span>
        </div>

        {/* Error */}
        {error && <div className="error-msg">⚠ {error}</div>}

        {/* Create / Edit form */}
        <div className="form-card">
          <div className="form-title">{editingId ? "✎ Edit note" : "+ New note"}</div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="form-actions">
            {editingId && (
              <button className="btn btn-secondary" onClick={clearForm}>
                Cancel
              </button>
            )}
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update" : "Add Note"}
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty">No notes yet. Create one above ↑</div>
          ) : (
            notes.map((note) => {
              const id = note._id || note.id;
              return (
                <div className="note-card" key={id}>
                  <h3>{note.title}</h3>
                  {note.content && <p>{note.content}</p>}
                  {note.updatedAt && (
                    <span className="note-meta">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                  <div className="note-actions">
                    <button className="btn btn-edit" onClick={() => startEdit(note)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}