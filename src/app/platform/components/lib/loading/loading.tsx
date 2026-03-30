import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './loading.module.scss';

type PlatformLoadingProps = {
  capture?: string;
};

export function PlatformLoading({ capture = '' }: PlatformLoadingProps) {
  return (
    <div className={styles.container}>
      <Spinner style={{fontSize: '2.5em'}} variant='accent' />
      {capture && <div className={styles.capture}>{capture}</div>}
    </div>
  );
}