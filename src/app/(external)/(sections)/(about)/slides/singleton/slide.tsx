import PiggyBank from '@/assets/ui-kit/icons/piggy-bank';
import styles from './slide.module.scss';
import Branching from '@/assets/ui-kit/icons/branching';
import Clients from '@/assets/ui-kit/icons/clients';
import Cube from '@/assets/ui-kit/icons/cube';
import Kanban from '@/assets/ui-kit/icons/kanban';
import Package from '@/assets/ui-kit/icons/package';
import Warehouse from '@/assets/ui-kit/icons/warehouse';

export  function SingletonSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.title}>Управляйте всем сразу</div>
                    <div className={styles.description}>От финансов до склада</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.box}>
                        <div className={styles.icon}><PiggyBank className={styles.svg} /></div>
                        <div className={styles.capture}>Финансы</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.icon}><Branching className={styles.svg} /></div>
                        <div className={styles.capture}>Задачи</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.icon}><Clients className={styles.svg} /></div>
                        <div className={styles.capture}>Клиенты</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.icon}><Kanban className={styles.svg} /></div>
                        <div className={styles.capture}>Сделки</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.icon}><Package className={styles.svg} /></div>
                        <div className={styles.capture}>Отправки</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.icon}><Warehouse className={styles.svg} /></div>
                        <div className={styles.capture}>Склад</div>
                        <div className={styles.description}>От финансов до склада</div>
                    </div>
                    <div className={styles.box}></div>
                    <div className={styles.box}></div>
                </div>
            </div>
        </div>
    )
}