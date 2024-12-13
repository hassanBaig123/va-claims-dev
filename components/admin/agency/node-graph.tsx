'use client'
import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'
import * as THREE from 'three'
import { stratify, tree } from 'd3-hierarchy'
import { scaleLinear } from 'd3-scale'
import { interpolateRgb } from 'd3-interpolate'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
})

// Custom type for ForceGraph3D instance
type ForceGraph3DInstance = {
  cameraPosition: (position: { x?: number; y?: number; z?: number }) => void
  camera: () => THREE.PerspectiveCamera
  zoomToFit: (duration: number, padding?: number) => void
  width: number
  height: number
  d3Force: (forceName: string, forceFn: any) => void
  // Add other methods and properties as needed
}

interface Node {
  id: string
  name: string
  type: string
  parentId?: string // Updated to use string | undefined
}

interface Link {
  id: string
  parent_node_id: string
  child_node_id: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

interface NodeGraphProps {
  width: number
  height: number
}

const NodeGraph: React.FC<NodeGraphProps> = ({ width, height }) => {
  const [showLabels, setShowLabels] = useState(true); // Set to true to turn on labels by default
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraph3DInstance | null>(null);

  const { data, isLoading, error } = useQuery<GraphData>(['nodeData'], fetchNodeData);

  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([0, 5]) // Adjust based on your expected depth range
      .range(['#ff0000', '#0000ff']) // Red to blue gradient
      .interpolate(interpolateRgb.gamma(2.2));
  }, []);

  const nodeThreeObject = useCallback((node: { [key: string]: any }) => {
    const color = node.type === 'model' ? '#ff0000' : '#0000ff'; // Red for model, Blue for step
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(8),
      new THREE.MeshBasicMaterial({ color })
    );

    sphere.userData.transitionDuration = 0.3; // in seconds

    if (showLabels) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = 'Bold 32px Arial';
        const text = node.name;
        const metrics = context.measureText(text);
        const textWidth = metrics.width;
        const textHeight = 32;

        // Increase canvas size for better visibility
        canvas.width = textWidth + 40;
        canvas.height = textHeight + 32;

        // Draw background
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.font = 'Bold 32px Arial';
        context.fillStyle = 'white';
        context.fillText(text, 20, textHeight + 8);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(canvas.width / 10, canvas.height / 10, 1); // Adjust scale for better visibility

        const updateSpritePosition = () => {
          const scale = sphere.scale.x;
          sprite.position.set(0, 12 * scale, 0);
        };
        updateSpritePosition();
        sphere.onBeforeRender = updateSpritePosition;

        sphere.add(sprite);
      }
    }

    return sphere;
  }, [showLabels]);

  const linkThreeObject = useCallback((link: { [key: string]: any }) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: '#ffffff' }));
    sprite.scale.set(2, 2, 1);
    return sprite;
  }, []);

  const linkPositionUpdate = useCallback((sprite: any, { start, end }: { start: any, end: any }) => {
    const middlePos = ['x', 'y', 'z'].reduce((acc, c) => {
      acc[c] = start[c] + (end[c] - start[c]) / 2;
      return acc;
    }, {} as { [key: string]: number });
    Object.assign(sprite.position, middlePos);
  }, []);

  const handleNodeHover = useCallback((node: { [key: string]: any } | null, prevNode: { [key: string]: any } | null) => {
    if (prevNode) {
      (prevNode as any).__threeObj.scale.set(1, 1, 1);
    }
    if (node) {
      (node as any).__threeObj.scale.set(1.5, 1.5, 1.5);
    }
  }, []);

  useEffect(() => {
    if (data) {
      // Fetch relationships data
      const fetchRelationships = async () => {
        const response = await fetch('/api/relationships');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      };

      fetchRelationships().then((relationships) => {
        console.log('Fetched relationships:', relationships);

        // Create a map of node relationships
        const nodeMap = new Map(data.nodes.map(node => [node.id, node]));
        const childNodeIds = new Set(relationships.map((rel: { child_node_id: any }) => rel.child_node_id));
        const rootNode = data.nodes.find(node => !childNodeIds.has(node.id));

        if (!rootNode) {
          throw new Error('No root node found');
        }

        console.log('Root node:', rootNode);

        // Update parentId based on relationships
        const nodesWithUpdatedParentId = data.nodes.map(node => {
          const parentLink = relationships.find((rel: { child_node_id: string }) => rel.child_node_id === node.id);
          return {
            ...node,
            parentId: parentLink ? parentLink.parent_node_id : undefined
          };
        });

        console.log('Nodes with updated parentId:', nodesWithUpdatedParentId);

        // Identify multiple root nodes
        const rootNodes = nodesWithUpdatedParentId.filter(node => !node.parentId);
        if (rootNodes.length > 1) {
          console.error('Multiple root nodes found:', rootNodes);
        }

        const stratifyData = stratify<Node>()
          .id((d: any) => d.id)
          .parentId((d: any) => d.parentId);

        try {
          const root = stratifyData(nodesWithUpdatedParentId);
          console.log('Stratified root:', root);

          const treeLayout = tree<Node>().size([width, height]);
          const hierarchicalData = treeLayout(root);
          console.log('Hierarchical data:', hierarchicalData);

          const nodes = hierarchicalData.descendants().map(d => ({ ...d.data, x: d.x, y: d.y, z: 0 }));
          const links = hierarchicalData.links().map(d => ({ source: d.source.data.id, target: d.target.data.id }));

          console.log('Nodes:', nodes);
          const formattedLinks = links.map(link => ({
            ...link,
            id: `${link.source}-${link.target}`,
            parent_node_id: link.source,
            child_node_id: link.target
          }));

          console.log('Formatted Links:', formattedLinks);

          setGraphData({ nodes, links: formattedLinks });
        } catch (error) {
          console.error('Error constructing hierarchy:', error);
        }
      }).catch((error) => {
        console.error('Error fetching relationships:', error);
      });
    }
  }, [data, width, height]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        setShowLabels(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current as ForceGraph3DInstance;
      const distance = 400; // Increased distance to zoom out further
      graph.cameraPosition({ z: distance });

      if (graph.camera()) {
        const camera = graph.camera() as THREE.PerspectiveCamera;
        camera.fov = 40; // Decreased FOV for a wider view
        camera.updateProjectionMatrix();
      }

      graph.zoomToFit(1000, 150); // Increased padding

      // Apply forces
      graph.d3Force('link', forceLink().id((d: any) => d.id).distance(50));
      graph.d3Force('charge', forceManyBody().strength(-100));
      graph.d3Force('center', forceCenter());
    }
  }, [graphData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center" ref={containerRef} tabIndex={0}>
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded">
        Labels: {showLabels ? 'On' : 'Off'} (Ctrl+Shift+L to toggle)
      </div>
      <ForceGraph3D
        ref={graphRef as any}
        graphData={graphData}
        nodeThreeObject={nodeThreeObject}
        linkThreeObject={linkThreeObject}
        linkPositionUpdate={linkPositionUpdate}
        linkDirectionalArrowLength={3.5} // Add directional arrows
        linkDirectionalArrowRelPos={1} // Position arrows at the end of the links
        linkWidth={4} // Adjust link width for better visibility
        linkColor={() => '#888888'} // Set link color to a lighter gray for better contrast
        linkDirectionalParticles={2} // Increase the number of particles to make the flow more apparent
        linkDirectionalParticleSpeed={0.006} // Increase the speed of the particles
        linkDirectionalParticleWidth={6} // Increase the size of the particles
        nodeAutoColorBy="type"
        nodeRelSize={8}
        nodeLabel={showLabels ? "name" : undefined}
        width={width}
        height={height}
        onNodeHover={handleNodeHover}
        onNodeClick={(node: { [key: string]: any }) => {
          console.log('Node clicked:', node);
        }}
        controlType="orbit"
      />
    </div>
  );
};

const fetchNodeData = async (): Promise<GraphData> => {
  const response = await fetch('/api/node')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default NodeGraph