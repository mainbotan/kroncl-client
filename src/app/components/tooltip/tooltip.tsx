import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './tooltip.module.scss';

interface CustomTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
}

export function ModalTooltip({ 
    children, 
    content, 
    side = 'top',
    align = 'center' 
}: CustomTooltipProps) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={styles.content}
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