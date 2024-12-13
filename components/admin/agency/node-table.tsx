import React, { useState, useEffect } from 'react';

interface Node {
    id: string | number;
    name: string;
    type: string;
    description: string;
    status?: string;
    createdAt?: string;
    collection?: Node[];
}

const NodeTable = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    // Assuming the ID of 'CreateCustomerReport' is known and is '1'
    const [expandedModels, setExpandedModels] = useState<{ [key: string | number]: boolean }>({});
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchNodes = async () => {
            const response = await fetch('/api/node');
            const data = await response.json();
            if (data && Array.isArray(data.nodes)) {
                console.log('Fetched nodes:', data.nodes);
                setNodes(data.nodes);
                const initialExpandedModels = data.nodes.reduce((acc: { [key: string | number]: boolean }, node: Node) => {
                    if (node.type === 'model') {
                        acc[node.id] = false;
                    }
                    return acc;
                }, {});
                console.log('Initial expanded models state:', initialExpandedModels);
                setExpandedModels(initialExpandedModels);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        };

        fetchNodes();
    }, []);

    const toggleModelExpansion = (modelId: string | number, event: React.MouseEvent) => {
        console.log('Toggling model expansion for:', modelId);
        
        setExpandedModels(prev => {
            const updatedModels = {
                ...prev,
                [modelId]: !prev[modelId],
            };
            console.log('Updated expanded models state:', updatedModels);
            return updatedModels;
        });
    };

    const handleRowClick = (node: Node) => {
        setSelectedNode(node);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Node Table</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {nodes && nodes.map((node) => (
                        <tr key={`node-${node.id}`} onClick={() => handleRowClick(node)}>
                            <td className="py-2 px-4 border-b">{node.name}</td>
                            <td className="py-2 px-4 border-b">{node.type}</td>
                            <td className="py-2 px-4 border-b">{node.status || 'N/A'}</td>
                            <td className="py-2 px-4 border-b">{node.createdAt || 'N/A'}</td>
                            <td className="py-2 px-4 border-b">{node.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && selectedNode && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-2xl font-bold mb-4">{selectedNode.name}</h2>
                        <p><strong>Type:</strong> {selectedNode.type}</p>
                        <p><strong>Status:</strong> {selectedNode.status || 'N/A'}</p>
                        <p><strong>Created At:</strong> {selectedNode.createdAt || 'N/A'}</p>
                        <p><strong>Description:</strong> {selectedNode.description}</p>
                        {selectedNode.collection && selectedNode.collection.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mt-4">Collection</h3>
                                <ul className="list-disc pl-5">
                                    {selectedNode.collection.map((childNode) => (
                                        <li key={`child-${childNode.id}`}>{childNode.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodeTable;