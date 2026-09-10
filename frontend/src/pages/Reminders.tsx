import { useState, useEffect, useCallback } from 'react';
import { Reminder, Habit } from '../types';
import apiClient from '../api/client';
import styles from './Reminders.module.css';
import { FiBell, FiPlus, FiTrash2, FiEdit2, FiClock, FiX } from 'react-icons/fi';

interface ReminderWithHabit extends Reminder {
  habitName?: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<ReminderWithHabit[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ habitId: 0, time: '08:00', days: 'Mon,Tue,Wed,Thu,Fri', enabled: true });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [rRes, hRes] = await Promise.all([
        apiClient.get('/api/reminders'),
        apiClient.get('/api/habits'),
      ]);
      setReminders(rRes.data);
      setHabits(hRes.data);
    } catch {
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm({ habitId: habits[0]?.id || 0, time: '08:00', days: 'Mon,Tue,Wed,Thu,Fri', enabled: true });
    setShowModal(true);
  };

  const openEdit = (r: ReminderWithHabit) => {
    setEditId(r.id);
    setForm({ habitId: r.habitId, time: r.time, days: r.days, enabled: r.enabled });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await apiClient.put(`/api/reminders/${editId}`, form);
      } else {
        await apiClient.post('/api/reminders', form);
      }
      setShowModal(false);
      fetchData();
    } catch {
      setError('Failed to save reminder');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/api/reminders/${id}`);
      fetchData();
    } catch {
      setError('Failed to delete reminder');
    }
  };

  const toggleEnabled = async (r: ReminderWithHabit) => {
    try {
      await apiClient.put(`/api/reminders/${r.id}`, { habitId: r.habitId, time: r.time, days: r.days, enabled: !r.enabled });
      fetchData();
    } catch {
      setError('Failed to update reminder');
    }
  };

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    const current = form.days.split(',').filter(Boolean);
    const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
    setForm({ ...form, days: next.join(',') });
  };

  if (loading) return <div className={styles.loading}>Loading reminders…</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Reminders</h1>
          <p className={styles.subtitle}>{reminders.length} reminder{reminders.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <FiPlus size={16} /> New Reminder
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {reminders.length === 0 ? (
        <div className={styles.empty}>
          <FiBell size={40} className={styles.emptyIcon} />
          <p>No reminders yet. Create one to stay on track!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {reminders.map(r => (
            <div key={r.id} className={`${styles.card} ${!r.enabled ? styles.cardDisabled : ''}`}>
              <div className={styles.cardLeft}>
                <div className={styles.iconWrap}>
                  <FiClock size={18} />
                </div>
                <div>
                  <div className={styles.habitName}>{r.habitName || `Habit #${r.habitId}`}</div>
                  <div className={styles.meta}>
                    <span className={styles.time}>{r.time}</span>
                    <span className={styles.days}>{r.days}</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardRight}>
                <button
                  className={`${styles.toggle} ${r.enabled ? styles.toggleOn : styles.toggleOff}`}
                  onClick={() => toggleEnabled(r)}
                  title={r.enabled ? 'Disable' : 'Enable'}
                >
                  <span className={styles.toggleDot} />
                </button>
                <button className={styles.iconBtn} onClick={() => openEdit(r)}><FiEdit2 size={15} /></button>
                <button className={styles.iconBtn} onClick={() => handleDelete(r.id)}><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editId ? 'Edit Reminder' : 'New Reminder'}</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><FiX size={18} /></button>
            </div>

            <label className={styles.label}>Habit</label>
            <select className={styles.select} value={form.habitId} onChange={e => setForm({ ...form, habitId: Number(e.target.value) })}>
              <option value={0} disabled>Select a habit</option>
              {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>

            <label className={styles.label}>Time</label>
            <input type="time" className={styles.input} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />

            <label className={styles.label}>Days</label>
            <div className={styles.dayPicker}>
              {dayLabels.map(d => (
                <button key={d} type="button" className={`${styles.dayChip} ${form.days.split(',').includes(d) ? styles.dayChipActive : ''}`} onClick={() => toggleDay(d)}>{d}</button>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={!form.habitId}>
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}