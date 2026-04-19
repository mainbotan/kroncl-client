import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Team from '@/assets/ui-kit/icons/team';
import Settings from '@/assets/ui-kit/icons/settings';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';

export function WayBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.section}>
                <div className={styles.col}>
                    <Team className={styles.svg} />
                </div>
                <div className={styles.col}>
                    <div className={styles.capture}>Начало работы</div>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <div className={styles.name}>Свяжитесь с компанией</div>
                            <div className={styles.about}>
                                Свяжитесь с организаторами компании с помощью контактных данных на этой странице.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Получите приглашение</div>
                            <div className={styles.about}>
                                Организаторы компании смогут отправить приглашение на вашу рабочую почту.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.col}>
                    <Settings className={styles.svg} />
                </div>
                <div className={styles.col}>
                    <div className={styles.capture}>Получите разрешения</div>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <div className={styles.name}>Через должности</div>
                            <div className={styles.about}>
                                После вступления в организацию владельцы смогут назначить вас на должность с определённым
                                набором разрешений.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Персональные</div>
                            <div className={styles.about}>
                                Вы так же сможете получить персональный набор разрешений, открывающий возможности внутри конкретных модулей.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.col}>
                    <SuccessStatus className={styles.svg} />
                </div>
                <div className={styles.col}>
                    <div className={styles.capture}>Используйте все возможности модулей компании</div>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <div className={styles.name}>Управление сделками</div>
                            <div className={styles.about}>
                                Создание сделок с автоматическим созданием/привязкой клиентов, загрузкой ассортимента услуг и товаров в состав сделки. Гибкое планирование будущих продаж, интеграция с модулем финансов.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Управление персоналом</div>
                            <div className={styles.about}>
                                Сотрудник не обязан иметь аккаунт, чтобы участвовать в отчетности компании. Стройте графики рабочих часов, отслеживайте активность сотрудников, планируйте зарплатные выплаты и поощрения за выполненную работу.                            
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Финансы</div>
                            <div className={styles.about}>
                                Получайте еженедельные отчёты о движении финансов вашего предприятия. Планируйте выплату кредитных обязательств, сокращайте кассовые разрывы и контролируйте выплаты сотрудникам.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Каталог & Склад</div>
                            <div className={styles.about}>
                                Структуризуйте ассортимент услуг/товаров вашего предприятия с возможностью регулярной выгрузки с помощью нашего открытого API. Настраивайте сезонные скидки, акции и рассылки о предложениях.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.name}>Клиенты</div>
                            <div className={styles.about}>
                                Перенесите клиентскую базу в защищённое хранилище Kroncl. Ведите индивидуальную историю клиентов, используйте инструменты повторого привлечения для повышения показателей удержания клиента.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}