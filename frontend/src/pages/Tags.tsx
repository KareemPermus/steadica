import { useState, useEffect } from 'react';
import { Tag } from '../types';
import apiClient from '../api/client';
import { FiTag, FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import styles from './Tags.module.css';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await apiClient.get('/api/tags');
      setTags(res.data);
    } catch { setError('Failed to load tags'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTags(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await apiClient.post('/api/tags', { name: newName.trim() });
      setTags(prev => [...prev, res.data]);
      setNewName('');
    } catch { setError('Failed to create tag'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/api/tags/${id}`);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch { setError('Failed to delete tag'); }
  };

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tags</h1>
          <p className={styles.subtitle}>{tags.length} tag{tags.length !== 1 ? 's' : ''} total</p>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.createRow}>
        <input
          className={styles.input}
          placeholder="New tag name…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <button className={styles.createBtn} onClick={handleCreate} disabled={creating || !newName.trim()}>
          <FiPlus size={16} /> Add Tag
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <FiSearch size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search tags…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No tags found</div>
        ) : (
          <div className={styles.tagGrid}>
            {filtered.map(tag => (
              <div key={tag.id} className={styles.tagChip}>
                <FiTag size={14} className={styles.tagIcon} />
                <span className={styles.tagName}>{tag.name}</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(tag.id)} aria-label={`Delete ${tag.name}`}>
                  <FiTrash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}