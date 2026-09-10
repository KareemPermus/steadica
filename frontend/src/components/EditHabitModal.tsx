import React, { useState } from 'react';
import { Category, Tag } from '../types';
import apiClient from '../api/client';
import styles from './HabitModal.module.css';
import { FiX } from 'react-icons/fi';

interface Props {
  habit: any;
  categories: Category[];
  tags: Tag[];
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditHabitModal({ habit, categories, onClose, onUpdated }: Props) {
  const [name, setName] = useState(habit.name || '');
  const [description, setDescription] = useState(habit.description || '');
  const [frequency, setFrequency] = useState(habit.frequency || 'daily');
  const [categoryId, setCategoryId] = useState<number | ''>(habit.categoryId || '');
  const [color, setColor] = useState(habit.color || '#10b981');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await apiClient.put(`/api/habits/${habit.id}`, {
        name: name.trim(),
        description: description.trim() || undefined,
        frequency,
        categoryId: categoryId || undefined,
        color,
      });
      onUpdated();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Habit</h3>
          <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} value={name} onChange={e => setName(e.target.value)} required />

          <label className={styles.label}>Description</label>
          <input className={styles.input} value={description} onChange={e => setDescription(e.target.value)} />

          <label className={styles.label}>Frequency</label>
          <select className={styles.input} value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Every day</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>

          <label className={styles.label}>Category</label>
          <select className={styles.input} value={categoryId} onChange={e => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">None</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className={styles.label}>Color</label>
          <input type="color" className={styles.colorInput} value={color} onChange={e => setColor(e.target.value)} />

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}