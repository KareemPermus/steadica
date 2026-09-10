import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, startOfWeek, addDays } from 'date-fns';
import { FiCheck, FiCalendar, FiFilter, FiSearch, FiEdit2 } from 'react-icons/fi';
import apiClient from '../api/client';
import type { Checkin } from '../types';
import styles from './Checkins.module.css';

interface CheckinRow {
  id: number;
  habitId: number;
  habitName: string;
  date: string;
  completed: boolean;
  note: string;
}

interface HabitOption {
  id: number;
  name: string;
}

export default function Checkins() {
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [habits, setHabits] = useState<HabitOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterHabit, setFilterHabit] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');

  const fetchCheckins = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/checkins');
      setCheckins(res.data);
    } catch {
      setError('Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckins();
    apiClient.get('/api/habits').then(r => setHabits(r.data)).catch(() => {});
  }, [fetchCheckins]);

  const toggleCheckin = async (c: CheckinRow) => {
    try {
      await apiClient.put(`/api/checkins/${c.id}`, { completed: !c.completed, note: c.note });
      setCheckins(prev => prev.map(x => x.id === c.id ? { ...x, completed: !x.completed } : x));
    } catch {
      setError('Failed to update check-in');
    }
  };

  const saveNote = async (c: CheckinRow) => {
    try {
      await apiClient.put(`/api/checkins/${c.id}`, { completed: c.completed, note: editNote });
      setCheckins(prev => prev.map(x => x.id === c.id ? { ...x, note: editNote } : x));
      setEditId(null);
    } catch {
      setError('Failed to save note');
    }
  };

  const filtered = checkins.filter(c => {
    if (filterHabit && c.habitId !== Number(filterHabit)) return false;
    if (search && !c.habitName.toLowerCase().includes(search.toLowerCase()) && !(c.note || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, CheckinRow[]>>((acc, c) => {
    const d = c.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(c);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const completedCount = filtered.filter(c => c.completed).length;

  if (loading) return <div className={styles.loading}>Loading check-ins…</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Check-ins</h1>
          <p className={styles.subtitle}>{completedCount} of {filtered.length} completed</p>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {/* Stats row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><FiCheck className={styles.statIcon} /> Completed</div>
          <div className={styles.statValue}>{completedCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><FiCalendar className={styles.statIcon} /> Total</div>
          <div className={styles.statValue}>{filtered.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Rate</div>
          <div className={styles.statValue}>{filtered.length ? Math.round(completedCount / filtered.length * 100) : 0}%</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search habits or notes…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.filterSelect} value={filterHabit} onChange={e => setFilterHabit(e.target.value)}>
          <option value="">All habits</option>
          {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {/* Checkin list grouped by date */}
      <div className={styles.listCard}>
        {sortedDates.length === 0 && <p className={styles.empty}>No check-ins found.</p>}
        {sortedDates.map(date => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateHeader}>{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</div>
            <div className={styles.items}>
              {grouped[date].map(c => (
                <div key={c.id} className={styles.checkinRow}>
                  <button className={`${styles.toggle} ${c.completed ? styles.toggleDone : ''}`} onClick={() => toggleCheckin(c)}>
                    {c.completed && <FiCheck size={14} />}
                  </button>
                  <div className={styles.checkinInfo}>
                    <div className={styles.habitName}>{c.habitName}</div>
                    {editId === c.id ? (
                      <div className={styles.noteEdit}>
                        <input className={styles.noteInput} value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="Add a note…" autoFocus onKeyDown={e => e.key === 'Enter' && saveNote(c)} />
                        <button className={styles.noteSave} onClick={() => saveNote(c)}>Save</button>
                        <button className={styles.noteCancel} onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className={styles.noteRow}>
                        <span className={styles.noteText}>{c.note || '—'}</span>
                        <button className={styles.editBtn} onClick={() => { setEditId(c.id); setEditNote(c.note || ''); }}><FiEdit2 size={12} /></button>
                      </div>
                    )}
                  </div>
                  <span className={c.completed ? styles.statusDone : styles.statusPending}>
                    {c.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}