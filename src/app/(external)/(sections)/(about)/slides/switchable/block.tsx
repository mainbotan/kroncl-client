'use client';

import { useState } from 'react';
import { SwitchBlock } from './switch/block';
import { tabs, TabId } from './_sections';

export function SwitchableBlock() {
    const [activeTab, setActiveTab] = useState<TabId>('modules');
    
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <>
            <SwitchBlock activeTab={activeTab} onTabChange={setActiveTab} />
            {ActiveComponent && <ActiveComponent />}
        </>
    );
}