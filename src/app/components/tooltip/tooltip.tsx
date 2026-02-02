import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './tooltip.module.scss';
import { clsx } from 'clsx';

interface CustomTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    compact?: boolean;
}

export function ModalTooltip({ 
    children, 
    content, 
    side = 'top',
    align = 'center',
    compact = false
}: CustomTooltipProps) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={clsx(styles.content, {
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