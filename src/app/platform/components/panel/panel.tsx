import clsx from 'clsx';
import styles from './panel.module.scss';

interface PlatformPanelProps {
  children: React.ReactNode;
  className?: string;
}

export default function PlatformPanel({
  children,
  className
}: Readonly<PlatformPanelProps>) {
    return (
        <div className={clsx(styles.panel, className)}>
              {children}
        </div>
    )
}