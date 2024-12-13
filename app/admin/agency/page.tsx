'use client';

import React, { useState, useEffect } from 'react';
import { ReadyCustomers } from '@/components/admin/agency/ready-customers';
import PatternSubscribe from '@/components/admin/agency/pattern-subscription';
import NodeGraph from '@/components/admin/agency/node-graph';
import NodeTable from '@/components/admin/agency/node-table';

const tabs = [
    { id: 'ready-customers', label: 'Ready Customers' },
    { id: 'pattern-subscribe', label: 'Pattern Subscribe' },
    { id: 'graph', label: 'Graph' },
    { id: 'node-table', label: 'Node Table' }, // New tab
];

export default function AgencyDashboard() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    // Set the active tab based on the URL hash
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && tabs.some(tab => tab.id === hash)) {
            setActiveTab(hash);
        }
    }, []);

    // Update the URL hash when the active tab changes
    useEffect(() => {
        window.location.hash = activeTab;
    }, [activeTab]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>
            
            <div className="mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 mr-2 rounded-t-lg ${
                            activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-b-lg p-4 border-t-2 border-blue-500">
                {activeTab === 'ready-customers' && <ReadyCustomers />}
                {activeTab === 'pattern-subscribe' && <PatternSubscribe />}
                {activeTab === 'graph' && (
                    <div className="flex items-center justify-center w-full h-[calc(100vh-200px)] bg-gray-100">
                        <NodeGraph width={1200} height={800} />
                    </div>
                )}
                {activeTab === 'node-table' && <NodeTable />}
            </div>
        </div>
    );
}