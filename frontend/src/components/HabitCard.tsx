import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import styles from './HabitCard.module.css';

interface Props {
  habit: any;
  onEdit: () => void;
  onDelete: () => void;
}

const COLORS: Record<string, { bg: string; text: string }> = {
  '#3b82f6': { bg: '#eff6ff', text: '#2563eb' },
  '#10b981': { bg: '#ecfdf5', text: '#059669' },
  '#f59e0b': { bg: '#fffbeb', text: '#d97706' },
  '#ef4444': { bg: '#fef2f2', text: '#dc2626' },
  '#8b5cf6': { bg: '#f5f3ff', text: '#7c3aed' },
  '#ec4899': { bg: '#fdf2f8', text: '#db2777' },
};

function getColorStyle(color?: string) {
  if (color && COLORS[color]) return COLORS[color];
  return { bg: '#f0fdf4', text: '#16a34a' };
}

export default function HabitCard({ habit, onEdit, onDelete }: Props) {
  const cs = getColorStyle(habit.color);

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: cs.bg, color: cs.text }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>{habit.name?.charAt(0)?.toUpperCase()}</span>
      </div>
      <div className={styles.info}>
        <Link to={`/habits/${habit.id}`} className={styles.name}>{habit.name}</Link>
        <div className={styles.meta}>
          {habit.frequency} {habit.tags?.length ? `· ${habit.tags.map((t: any) => t.name).join(', ')}` : ''}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={onEdit} title="Edit"><FiEdit2 size={15} /></button>
        <button className={styles.iconBtn} onClick={onDelete} title="Delete"><FiTrash2 size={15} /></button>
        <Link to={`/habits/${habit.id}`} className={styles.iconBtn} title="Details"><FiChevronRight size={16} /></Link>
      </div>
    </div>
  );
}