import { useState } from 'react';
import styles from './styles.module.scss';

interface BarProps {
  data: {
    label: string;
    value: number;
  };
  maxValue: number;
  minValue: number;
  barColor: string;
  hoverColor: string;
  showValue: boolean;
}

export function Bar({ data, maxValue, minValue, barColor, hoverColor = '', showValue }: BarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const heightPercentage = ((data.value - minValue) / (maxValue - minValue)) * 100;
  
  return (
    <div className={styles.barWrapper}>
      <div className={styles.barContainer}>
        {showValue && (
          <div className={styles.valueLabel}>
            {data.value}
          </div>
        )}
        
        <div
          className={styles.bar}
          style={{
            height: `${Math.max(heightPercentage, 2)}%`,
            backgroundColor: isHovered ? hoverColor : barColor,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title={`${data.label}: ${data.value}`}
        />
      </div>
{/*       
      <span className={styles.barLabel}>
        {data.label}
      </span> */}
    </div>
  );
}