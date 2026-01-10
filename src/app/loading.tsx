import Spinner from '@/assets/ui-kit/spinner/spinner';
import plug from '@/assets/chunks/plug.module.scss';

export default function Loading() {
    return (
        <div className={plug.container}>
            <div className={plug.focus}>
                <Spinner variant='brand' size='lg' />
            </div>
        </div>
    );
}