import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './tooltip.module.scss';
import { clsx } from 'clsx';

interface CustomTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    compact?: boolean;
    location?: 'left' | 'center' | 'right'
    className?: string;
}

export function ModalTooltip({ 
    children, 
    content, 
    side = 'top',
    align = 'center',
    compact = false,
    className,
    location = 'center'
}: CustomTooltipProps) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={clsx(styles.content, className, styles[location], {
                            [styles.compact]: compact
                        })}
                        side={side}
                        align={align}
                        sideOffset={5}
                    >
                        {content}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}