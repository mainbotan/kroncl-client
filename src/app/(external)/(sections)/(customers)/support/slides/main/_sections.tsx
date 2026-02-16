import Support from "@/assets/ui-kit/icons/support";
import { SectionProps } from "./section/section";
import Book from "@/assets/ui-kit/icons/book";
import Mail from "@/assets/ui-kit/icons/mail";
import Dev from "@/assets/ui-kit/icons/dev";

export const sectionsList: SectionProps[] = [
    {
        icon: <Support />,
        capture: 'Поддержка 24/7',
        description: 'Круглосуточная поддержка клиентов. Для создания тикета необходимо иметь аккаунт. Среднее время ответа - 1ч.',
        actions: [
            {
                children: 'Создать тикет'
            }
        ]
    },
    {
        icon: <Book />,
        capture: 'Документация',
        description: 'Собрали руководство по всему функционалу системы. Возникло затруднее в процессе работы? - загляните сюда.',
        actions: [
            {
                children: 'Читать'
            }
        ]
    },
    {
        icon: <Mail />,
        capture: 'Партнёрство и всякое',
        description: 'Напишите на почту администрации и получите ответ как можно скорее.',
        actions: [
            {
                children: 'Написать'
            }
        ]
    },
    {
        icon: <Dev />,
        capture: 'Разработчикам',
        description: 'Возник вопрос о внутреннем устройстве платформы, уровнях безопасности или просто хочется учавствовать в создании Kroncl? - скорее пишите.',
        actions: [
            {
                children: 'Написать'
            }
        ]
    }
]