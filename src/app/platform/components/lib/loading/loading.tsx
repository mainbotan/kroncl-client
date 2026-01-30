import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './loading.module.scss';

type PlatformLoadingProps = {
  capture?: string;
};

export function PlatformLoading({ capture = '' }: PlatformLoadingProps) {
  return (
    <div className={styles.container}>
      <Spinner variant='contrast' />
      {capture && <div className={styles.capture}>{capture}</div>}
    </div>
  );
}