import styles from './StreakDisplay.module.css';
import { FiZap } from 'react-icons/fi';

interface Props { label: string; value: number; }

export default function StreakDisplay({ label, value }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.labelRow}><FiZap size={14} /> {label}</div>
      <div className={styles.value}>{value} <span className={styles.unit}>days</span></div>
    </div>
  );
}