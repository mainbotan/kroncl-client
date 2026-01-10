import Cross from '@/assets/ui-kit/svgs/cross/cross';
import styles from './slide.module.scss';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { accountActionsLinks } from '@/config/links.config';
import Team from '@/assets/ui-kit/icons/team';
import Wallet from '@/assets/ui-kit/icons/wallet';
import Kanban from '@/assets/ui-kit/icons/kanban';
import Warehouse from '@/assets/ui-kit/icons/warehouse';
import TwoCards from '@/assets/ui-kit/icons/two-cards';
import Dev from '@/assets/ui-kit/icons/dev';
import Chart from '@/assets/ui-kit/icons/chart';
import Clients from '@/assets/ui-kit/icons/clients';
import Book from '@/assets/ui-kit/icons/book';
import { LogoText } from '@/assets/ui-kit/logo/text/text';

export function TariffsSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <Cross className={styles.cross} />
                    <Cross className={styles.cross} />
                    <div className={styles.card}>
                        <div className={styles.trial}>Бесплатно 30 дней</div>
                        <div className={styles.info}>
                            <div className={styles.price}>
                                <span className={styles.value}>256<span className={styles.secondary}>.00</span></span>
                                <span className={styles.currency}>RUB</span>
                            </div>
                            <div className={styles.period}>
                                / 30 дней
                            </div>
                            <div className={styles.name}>Начинающий</div>
                            <div className={styles.description}>
                                Идеальный выбор для предприятий, только начавших становление (менее 1 года с начала получения прибыли), с штатом сотрудников
                                до 10 человек.
                                <br /><br />
                                Получите первые сведения о рентабельности бизнеса.
                            </div>
                        </div>
                        <div className={styles.features}>
                            <div className={styles.group}>
                                <div className={styles.capture}>Модули</div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Clients className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Клиенты</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Team className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сотрудники</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Kanban className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сделки</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Warehouse className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Склад</div>
                                    </span>
                                    <span className={styles.tag}>Упрощённый</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><TwoCards className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Ассортимент услуг</div>
                                    </span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.capture}>Лимиты</div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Пользователи</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сделки</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Запросы в день</div>
                                    </span>
                                    <span className={styles.value}>до 5 000</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Link href={`${accountActionsLinks.createCompany}?tariff=start`}><Button className={styles.action} variant='brand'>Создать организацию</Button></Link>
                            <Link href='/tariffs/switching' className={styles.addition}>Переход между тарифами</Link>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.info}>
                            <div className={styles.price}>
                                <span className={styles.value}>940<span className={styles.secondary}>.00</span></span>
                                <span className={styles.currency}>RUB</span>
                            </div>
                            <div className={styles.period}>
                                / 30 дней
                            </div>
                            <div className={styles.name}>Растущий бизнес</div>
                            <div className={styles.description}>
                                Предприятие начинает набирать обороты, потребность в структуризации учёта становится всё больше заметна. 
                                Численность сотрудников растёт, а от Excel уже начинают болеть глаза.
                            </div>
                        </div>
                        <div className={styles.features}>
                            <div className={styles.group}>
                                <div className={styles.capture}>Модули</div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Chart className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={clsx(styles.tag)}>Упрощённый</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Wallet className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Финансы</div>
                                    </span>
                                    <span className={styles.tag}>Упрощённый</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Dev className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Доступ API</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Warehouse className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Склад</div>
                                    </span>
                                    <span className={clsx(styles.tag, styles.accent)}>Расширенный</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Контроль закупок</div>
                                    </span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.capture}>Лимиты</div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Пользователи</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сделки</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Запросы в день</div>
                                    </span>
                                    <span className={styles.value}>до 10 000</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Запросы API</div>
                                    </span>
                                    <span className={styles.value}>до 1 000</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Link href={`${accountActionsLinks.createCompany}?tariff=start`}><Button className={styles.action} variant='brand'>Создать организацию</Button></Link>
                            <Link href='/tariffs/switching' className={styles.addition}>Переход между тарифами</Link>
                        </div>
                    </div>
                    <div className={clsx(styles.card, styles.brand)}>
                        <div className={styles.info}>
                            <div className={styles.price}>
                                <span className={styles.value}>2560<span className={styles.secondary}>.00</span></span>
                                <span className={styles.currency}>RUB</span>
                            </div>
                            <div className={styles.period}>
                                / 30 дней
                            </div>
                            <div className={styles.name}>Лидер</div>
                            <div className={styles.description}>
                                Оставьте конкурентов позади, превратя бухгалтерский учёт в главный инструмент планирования. 
                                Автоматизируйте весь цикл жизни бизнеса, внедря финансовое планирование на месяцы вперёд.
                            </div>
                        </div>
                        <div className={styles.features}>
                            <div className={styles.group}>
                                <div className={styles.capture}>Модули</div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Book className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Налоговые документы</div>
                                    </span>
                                    <span className={clsx(styles.tag)}>РФ, КЗ</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Chart className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={clsx(styles.tag, styles.accent)}>Расширенный</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сквозная аналитика</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}><Wallet className={styles.svg} /></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Финансы</div>
                                    </span>
                                    <span className={clsx(styles.tag, styles.accent)}>Расширенный</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Планирование бюджета</div>
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.icon}></span>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Расчёт кредитных обязательств</div>
                                    </span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.capture}>Лимиты</div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Пользователи</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Сделки</div>
                                    </span>
                                    <span className={styles.value}>без ограничений</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Запросы в день</div>
                                    </span>
                                    <span className={styles.value}>до 15 000</span>
                                </div>
                                <div className={styles.row}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Запросы API</div>
                                    </span>
                                    <span className={styles.value}>до 3 000</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Link href={`${accountActionsLinks.createCompany}?tariff=start`}><Button className={styles.action}>Создать организацию</Button></Link>
                            <Link href='/tariffs/switching' className={styles.addition}>Переход между тарифами</Link>
                        </div>
                    </div>
                    <div className={clsx(styles.card, styles.enterprise)}>
                        <div className={styles.logo}><LogoText /></div>
                        <div className={styles.info}>
                            <div className={styles.name}>Крупному бизнесу</div>
                            <div className={styles.description}>
                                Мигрируйте с корпоративного 1с на гибкую модульную систему учёта без ущерба 
                                налоговой отчётности.
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Link href='/enterprise'><Button className={styles.action}>Обсудить условия</Button></Link>
                        </div>
                        <div className={styles.benchmarks}>
                            <section className={styles.section}>
                                <div className={styles.value}>2x</div>
                                <div className={styles.capture}>к скорости обучения новых менеджеров</div>
                                {/* <div className={styles.description}>faster</div> */}
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>99<span className={styles.secondary}>%</span></div>
                                <div className={clsx(styles.capture, styles.bold)}>SLA</div>
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>26<span className={styles.secondary}>h/w</span></div>
                                <div className={styles.capture}>экономия времени сотрудников</div>
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>78<span className={styles.secondary}>%</span></div>
                                <div className={styles.capture}>покрытие налогового законодательства РФ, КЗ</div>
                            </section>
                        </div>
                        <div className={styles.features}>
                            <div className={styles.group}>
                                <div className={styles.capture}>Наши возможности</div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                                <div className={styles.indicator}>
                                    <span className={styles.about}>
                                        <div className={styles.name}>Аналитика</div>
                                    </span>
                                    <span className={styles.marker}><span className={styles.circle} /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}