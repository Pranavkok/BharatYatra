import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Billboard, Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { INDIA_MAP, getNode } from '../game/constants';
import type { Player } from '../game/types';

interface MapProps {
  // ... existing interface ...
  players: Player[];
  fairyNodeId: string;
  treasureNodeIds: string[];
  shopNodeIds: string[];
  validMoves: string[];
  currentPlayerId: string | null;
  onNodeClick: (nodeId: string) => void;
  zoomedNodeId?: string | null;
  isZooming?: boolean;
}

// Coordinate conversion constants
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;
const MAP_SCALE = 0.02; // Scale down the 1000x1000 coordinates
// Center the map at (0,0) logic: (value - dimension/2) * scale
const to3D = (x: number, y: number): [number, number, number] => {
  return [
    (x - MAP_WIDTH / 2) * MAP_SCALE,
    0, // Y is up
    (y - MAP_HEIGHT / 2) * MAP_SCALE,
  ];
};

const CameraController: React.FC<{
  isZooming: boolean;
  zoomedNodeId?: string | null;
}> = ({ isZooming, zoomedNodeId }) => {
  const { camera, controls } = useThree();
  const controlsRef = useRef<any>(controls);

  useEffect(() => {
    // Default Overview Position - Moved back and up to fit entire map
    const overviewPos = { x: 0, y: 25, z: 25 };
    const overviewTarget = { x: 0, y: 0, z: 0 };

    if (isZooming && zoomedNodeId) {
      const node = getNode(zoomedNodeId);
      if (node) {
        const [nx, , nz] = to3D(node.x, node.y);

        // Animate to Zoomed View (High angle close up)
        // Position: Offset slightly back and up from the node
        gsap.to(camera.position, {
          duration: 1.5,
          x: nx,
          y: 5, // Lower height for close up
          z: nz + 6, // Distance from node
          ease: "power3.inOut"
        });

        // Use controls to look at the node
        if (controlsRef.current) {
          gsap.to(controlsRef.current.target, {
            duration: 1.5,
            x: nx,
            y: 0,
            z: nz,
            ease: "power3.inOut"
          });
        }
      }
    } else {
      // Animate back to Overview
      gsap.to(camera.position, {
        duration: 2,
        x: overviewPos.x,
        y: overviewPos.y,
        z: overviewPos.z,
        ease: "power3.inOut"
      });

      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          duration: 2,
          x: overviewTarget.x,
          y: overviewTarget.y,
          z: overviewTarget.z,
          ease: "power3.inOut"
        });
      }
    }
  }, [isZooming, zoomedNodeId, camera, controls]);

  return <OrbitControls
    ref={controlsRef}
    enablePan={true}
    minPolarAngle={0}
    maxPolarAngle={Math.PI / 2.2} // Prevent going below ground
    enableZoom={!isZooming} // Disable manual zoom during auto-zoom
  />;
};

const MapNode: React.FC<{
  node: typeof INDIA_MAP[0];
  isValid: boolean;
  isFairy: boolean;
  isTreasure: boolean;
  isShop: boolean;
  isStart: boolean;
  onClick: () => void;
  color: string;
}> = ({ node, isValid, isFairy, isTreasure, isShop, isStart, onClick, color }) => {
  const [x, , z] = to3D(node.x, node.y);

  // Pulsing effect for valid moves
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      if (isValid) {
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 3) * 0.2;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Glow/Indicator for valid moves */}
      {isValid && (
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.8, 32]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* The Node Sphere */}
      <mesh
        ref={meshRef}
        position={[0, 0.2, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={isValid ? color : '#000000'}
          emissiveIntensity={isValid ? 0.5 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Label - Always faces camera */}
      <Billboard position={[0, 1.2, 0]} follow={true}>
        <Text
          fontSize={0.55}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="black"
          fontWeight="bold"
        >
          {node.name}
        </Text>
        {isFairy && <Text position={[0, -0.2, 0]} fontSize={0.3}>🧚</Text>}
        {isTreasure && <Text position={[0, -0.2, 0]} fontSize={0.3}>💎</Text>}
        {isShop && !isFairy && !isTreasure && <Text position={[0, -0.2, 0]} fontSize={0.3}>🏪</Text>}
        {isStart && !isFairy && !isTreasure && <Text position={[0, -0.2, 0]} fontSize={0.3}>🚩</Text>}
      </Billboard>
    </group>
  );
};

const PlayerPawn: React.FC<{
  player: Player;
  isMe: boolean;
}> = ({ player, isMe }) => {
  const node = getNode(player.currentNodeId);
  const targetPos = useMemo(() => {
    if (!node) return [0, 0, 0];
    return to3D(node.x, node.y);
  }, [node]);

  // Spring animation for smooth movement could go here, 
  // currently we just snap or lerp. 
  // Using simple interpolation in useFrame for smoothness if needed, 
  // but let's stick to direct placement for v1 or allow react-spring if we added it.

  // Simple offset to avoid Z-fighting if multiple players on same node
  // In a real 3D game we might want them to stand around the node.
  // For now, let's just let them overlap or add a small random offset?
  // Let's stick to the previous offset logic but in 3D (X/Z plane).

  return (
    <group position={[targetPos[0], 0, targetPos[2]]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1, 16]} />
        <meshStandardMaterial color={player.color} />
      </mesh>
      {/* Player Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={player.color} />
      </mesh>

      <Billboard position={[0, 1.6, 0]}>
        <Text fontSize={0.3} color="black" outlineWidth={0.02} outlineColor="white">
          {player.name}
          {isMe && " (You)"}
        </Text>
      </Billboard>
    </group>
  );
};


export const IndiaMap: React.FC<MapProps> = ({
  players,
  fairyNodeId,
  treasureNodeIds,
  shopNodeIds,
  validMoves,
  currentPlayerId,
  onNodeClick,
  zoomedNodeId = null,
  isZooming = false,
}) => {

  const edges = useMemo(() => {
    const list: JSX.Element[] = [];
    const drawn = new Set<string>();

    INDIA_MAP.forEach((node) => {
      const [x1, , z1] = to3D(node.x, node.y);

      node.neighbors.forEach((neighborId) => {
        const neighbor = INDIA_MAP.find(n => n.id === neighborId);
        if (neighbor) {
          const edgeKey = [node.id, neighborId].sort().join('-');
          if (!drawn.has(edgeKey)) {
            drawn.add(edgeKey);
            const [x2, , z2] = to3D(neighbor.x, neighbor.y);

            const isValidPath = validMoves.includes(node.id) || validMoves.includes(neighborId);

            list.push(
              <Line
                key={edgeKey}
                points={[[x1, 0.2, z1], [x2, 0.2, z2]]} // Lift slightly off ground
                color={isValidPath ? '#f97316' : '#94a3b8'} // Orange if valid, Slate if not
                lineWidth={isValidPath ? 3 : 1}
                dashed={!isValidPath}
                dashScale={2}
                opacity={isValidPath ? 0.8 : 0.4}
                transparent
              />
            );
          }
        }
      });
    });
    return list;
  }, [validMoves]);

  const getNodeColor = (nodeId: string) => {
    if (nodeId === 'kanyakumari') return '#f97316';
    if (fairyNodeId === nodeId) return '#ec4899';
    if (treasureNodeIds.includes(nodeId)) return '#eab308';
    if (shopNodeIds.includes(nodeId)) return '#8b5cf6';
    return '#3b82f6';
  };

  return (
    <div className="w-full h-[700px] bg-sky-100 rounded-2xl overflow-hidden shadow-inner relative">
      <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
        <color attach="background" args={['#e0f2fe']} /> {/* Sky blue background */}

        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

        <CameraController isZooming={!!isZooming} zoomedNodeId={zoomedNodeId} />

        {/* The Map Plane (Ground) */}
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          {/* Use the SVG image as a texture on a plane */}
          {/* We need to size it correctly. 1000x1000 units? Scaled down to match our to3D logic.
                    MAP_SCALE is 0.02. 1000 * 0.02 = 20 world units.
                */}
          <DreiImage
            url="/asset/india_map.svg"
            transparent
            opacity={0.6}
            scale={[20, 20]} // Width, Height
            position={[0, 0, 0]} // Center
            toneMapped={false}
          />
        </group>

        {/* Nodes */}
        {INDIA_MAP.map((node) => (
          <MapNode
            key={node.id}
            node={node}
            isValid={validMoves.includes(node.id)}
            isFairy={fairyNodeId === node.id}
            isTreasure={treasureNodeIds.includes(node.id)}
            isShop={shopNodeIds.includes(node.id)}
            isStart={node.nodeType === 'START'}
            color={getNodeColor(node.id)}
            onClick={() => validMoves.includes(node.id) && onNodeClick(node.id)}
          />
        ))}

        {/* Edges */}
        {edges}

        {/* Players */}
        {players.map(player => (
          <PlayerPawn
            key={player.id}
            player={player}
            isMe={player.id === currentPlayerId}
          />
        ))}

      </Canvas>

      {/* Helper UI Overlays can go here (Legend, etc) - keeping them outside canvas for sharp text */}
      <div className={`absolute bottom-4 left-4 bg-white/90 rounded-xl p-3 shadow-lg text-xs pointer-events-none transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
        <div className="font-semibold mb-2 text-gray-800">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" /> Start
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500" /> 🧚 Fairy
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" /> 💎 Treasure
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" /> 🏪 Shop
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" /> City
          </div>
        </div>
      </div>

      {/* Region Info Overlay when zoomed */}
      {isZooming && zoomedNodeId && (
        <div className="absolute bottom-4 left-0 right-0 p-4 flex justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-md w-full border border-white/50">
            {(() => {
              const node = getNode(zoomedNodeId);
              return node ? (
                <>
                  <h3 className="text-2xl font-bold text-orange-600 mb-1">{node.name}</h3>
                  <p className="text-gray-600 font-medium">{node.region}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Culture</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Tourism</span>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}

    </div>
  );
};

