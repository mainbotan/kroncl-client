import { Bar } from './bar';
import styles from './styles.module.scss';

import { BarChartProps } from './types';

export function BarChart({
  data,
  width = '100%',
  height = 20, // 20em по умолчанию
  barColor = 'var(--color-contrast)',
  hoverColor = 'var(--color-contrast)',
  showGrid = true,
  showValues = false,
  xAxisLabel,
  yAxisLabel,
  className = '',
  baseFontSize = 0.8
}: BarChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));

  return (
    <div 
      className={`${styles.container} ${className}`}
      style={{ 
        width, 
        height: `${height}em`,
        fontSize: `${baseFontSize}em` // устанавливаем базовый размер
      }}
    >
      {/* {(yAxisLabel || showGrid) && (
        <div className={styles.yAxis}>
          {yAxisLabel && <span className={styles.yAxisLabel}>{yAxisLabel}</span>}
          {showGrid && <div className={styles.gridLines} />}
        </div>
      )} */}
      
      <div className={styles.chartArea}>
        <div className={styles.barsContainer}>
          {data.map((item, index) => (
            <Bar
              key={item.id || index}
              data={item}
              maxValue={maxValue}
              minValue={minValue}
              barColor={barColor}
              hoverColor={hoverColor}
              showValue={showValues}
            />
          ))}
        </div>
        
        <div className={styles.xAxis}>
          {xAxisLabel && <span className={styles.xAxisLabel}>{xAxisLabel}</span>}
          <div className={styles.labels}>
            {data.map((item, index) => (
              <span 
                key={item.id || index} 
                className={styles.label}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}