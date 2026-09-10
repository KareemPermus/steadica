import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '../types';
import apiClient from '../api/client';
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import styles from './Categories.module.css';

interface CategoryWithCount extends Category {
  habitCount?: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [form, setForm] = useState({ name: '', color: '#10b981' });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/categories');
      setCategories(res.data);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', color: '#10b981' });
    setModalOpen(true);
  };

  const openEdit = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, color: cat.color || '#10b981' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      if (editingCategory) {
        await apiClient.put(`/api/categories/${editingCategory.id}`, form);
      } else {
        await apiClient.post('/api/categories', form);
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await apiClient.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const PRESET_COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>{categories.length} categories</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <FiPlus size={16} /> New Category
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>Loading…</div>
        ) : error ? (
          <div className={styles.empty}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No categories found</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(cat => (
              <div key={cat.id} className={styles.catCard}>
                <div className={styles.catHeader}>
                  <div className={styles.catIcon} style={{ backgroundColor: `${cat.color || '#10b981'}18`, color: cat.color || '#10b981' }}>
                    <FiFolder size={18} />
                  </div>
                  <div className={styles.catActions}>
                    <button className={styles.iconBtn} onClick={() => openEdit(cat)}><FiEdit2 size={14} /></button>
                    <button className={styles.iconBtn} onClick={() => handleDelete(cat.id)}><FiTrash2 size={14} /></button>
                  </div>
                </div>
                <div className={styles.catName}>{cat.name}</div>
                <div className={styles.catCount}>{cat.habitCount ?? 0} habits</div>
                <div className={styles.colorDot} style={{ backgroundColor: cat.color || '#10b981' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
              <button className={styles.iconBtn} onClick={() => setModalOpen(false)}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Health & Fitness"
                autoFocus
              />
              <label className={styles.label}>Color</label>
              <div className={styles.colorPicker}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.colorSwatch} ${form.color === c ? styles.colorSwatchActive : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                  />
                ))}
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editingCategory ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}