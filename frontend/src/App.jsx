import { useState, useEffect, useCallback } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "./api";

/* ─── Toast helper ─────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

/* ─── NoteForm ─────────────────────────────────────────── */
function NoteForm({ initial, onSubmit, onCancel, loading }) {
  const [title, setTitle]       = useState(initial?.title || "");
  const [description, setDesc]  = useState(initial?.description || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setDesc(initial?.description || "");
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="form-card">
      <h2>{initial ? "✏️  Edit Note" : "➕  New Note"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="note-title">Title *</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your note a title…"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="note-description">Description</label>
          <textarea
            id="note-description"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add some details (optional)…"
          />
        </div>
        <div className="form-actions">
          <button
            id="btn-submit-note"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !title.trim()}
          >
            {loading ? "Saving…" : initial ? "Update Note" : "Add Note"}
          </button>
          {onCancel && (
            <button
              id="btn-cancel-note"
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ─── NoteCard ─────────────────────────────────────────── */
function NoteCard({ note, onEdit, onDelete, isEditing }) {
  const date = new Date(note.created_at).toLocaleString();
  return (
    <div className={`note-card ${isEditing ? "editing" : ""}`}>
      <div className="note-title">{note.title}</div>
      {note.description && (
        <div className="note-description">{note.description}</div>
      )}
      <div className="note-actions">
        <button
          id={`btn-edit-${note.id}`}
          className="btn btn-edit btn-sm"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>
        <button
          id={`btn-delete-${note.id}`}
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
      <div className="note-meta">Created {date}</div>
    </div>
  );
}

/* ─── App ──────────────────────────────────────────────── */
export default function App() {
  const [notes,       setNotes]       = useState([]);
  const [editing,     setEditing]     = useState(null);   // Note being edited or null
  const [showForm,    setShowForm]    = useState(false);  // show add form?
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);
  const { toasts, add: addToast }     = useToast();

  /* Fetch all notes */
  const fetchNotes = useCallback(async () => {
    try {
      setFetching(true);
      const res = await getNotes();
      setNotes(res.data);
    } catch {
      addToast("Failed to load notes.", "error");
    } finally {
      setFetching(false);
    }
  }, [addToast]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  /* Create */
  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const res = await createNote(data);
      setNotes((n) => [res.data, ...n]);
      setShowForm(false);
      addToast("Note created!");
    } catch {
      addToast("Failed to create note.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Update */
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const res = await updateNote(editing.id, data);
      setNotes((n) => n.map((x) => (x.id === editing.id ? res.data : x)));
      setEditing(null);
      addToast("Note updated!");
    } catch {
      addToast("Failed to update note.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      setNotes((n) => n.filter((x) => x.id !== id));
      if (editing?.id === id) setEditing(null);
      addToast("Note deleted.");
    } catch {
      addToast("Failed to delete note.", "error");
    }
  };

  const startEdit = (note) => {
    setEditing(note);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => setEditing(null);

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <p>Create, read, update and delete your notes — powered by Django + React + PostgreSQL</p>
      </header>

      {/* DB status indicator */}
      <div className="status-bar">
        <span className="status-dot" />
        <span>Connected to PostgreSQL via Django REST API</span>
      </div>

      {/* Edit form (appears at top when editing) */}
      {editing && (
        <NoteForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={cancelEdit}
          loading={loading}
        />
      )}

      {/* Add-new button / form */}
      {!editing && (
        showForm ? (
          <NoteForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        ) : (
          <button
            id="btn-show-form"
            className="btn btn-primary"
            style={{ marginBottom: "1.5rem" }}
            onClick={() => setShowForm(true)}
          >
            + Add New Note
          </button>
        )
      )}

      {/* Notes list */}
      <div className="notes-header">
        <h2>All Notes</h2>
        <span className="badge">{notes.length}</span>
      </div>

      {fetching ? (
        <div className="spinner" />
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗒️</div>
              <p>No notes yet. Click <strong>+ Add New Note</strong> to get started.</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={startEdit}
                onDelete={handleDelete}
                isEditing={editing?.id === note.id}
              />
            ))
          )}
        </div>
      )}

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
