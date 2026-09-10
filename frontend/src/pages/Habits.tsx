import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Habit, Category, Tag } from '../types';
import apiClient from '../api/client';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import styles from './Habits.module.css';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

export default function Habits() {
  const [habits, setHabits] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const [showCreate, setShowCreate] = useState(false);
  const [editHabit, setEditHabit] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [hRes, cRes, tRes] = await Promise.all([
        apiClient.get('/api/habits'),
        apiClient.get('/api/categories'),
        apiClient.get('/api/tags'),
      ]);
      setHabits(hRes.data);
      setCategories(cRes.data);
      setTags(tRes.data);
      setError('');
    } catch {
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = habits.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === '' || h.categoryId === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/api/habits/${id}`);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Habits</h1>
          <p className={styles.subtitle}>{habits.length} habits tracked</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowCreate(true)}>
          <FiPlus size={16} /> New Habit
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <FiSearch size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search habits…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterWrap}>
          <FiFilter size={14} />
          <select
            className={styles.filterSelect}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className={styles.statusMsg}>Loading…</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className={styles.statusMsg}>No habits found. Create one to get started!</p>
      )}

      <div className={styles.list}>
        {filtered.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={() => setEditHabit(habit)}
            onDelete={() => handleDelete(habit.id)}
          />
        ))}
      </div>

      {showCreate && (
        <CreateHabitModal
          categories={categories}
          tags={tags}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchData(); }}
        />
      )}

      {editHabit && (
        <EditHabitModal
          habit={editHabit}
          categories={categories}
          tags={tags}
          onClose={() => setEditHabit(null)}
          onUpdated={() => { setEditHabit(null); fetchData(); }}
        />
      )}
    </div>
  );
}