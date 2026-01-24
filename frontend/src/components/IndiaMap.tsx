import React from 'react';
import { INDIA_MAP, getNode } from '../game/constants';
import type { Player } from '../game/types';
import { motion } from 'framer-motion';

interface MapProps {
  players: Player[];
  fairyNodeId: string;
  treasureNodeIds: string[];
  shopNodeIds: string[];
  validMoves: string[];
  currentPlayerId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export const IndiaMap: React.FC<MapProps> = ({
  players,
  fairyNodeId,
  treasureNodeIds,
  shopNodeIds,
  validMoves,
  currentPlayerId,
  onNodeClick,
}) => {
  // Draw edges between connected nodes
  const renderEdges = () => {
    const edges: JSX.Element[] = [];
    const drawn = new Set<string>();

    INDIA_MAP.forEach((node) => {
      node.neighbors.forEach((neighborId) => {
        const neighbor = INDIA_MAP.find((n) => n.id === neighborId);
        if (neighbor) {
          const edgeKey = [node.id, neighborId].sort().join('-');
          if (!drawn.has(edgeKey)) {
            drawn.add(edgeKey);
            const isValidPath = validMoves.includes(node.id) || validMoves.includes(neighborId);
            edges.push(
              <line
                key={edgeKey}
                x1={node.x}
                y1={node.y}
                x2={neighbor.x}
                y2={neighbor.y}
                stroke={isValidPath ? '#f97316' : '#cbd5e1'}
                strokeWidth={isValidPath ? 3 : 2}
                strokeDasharray={isValidPath ? undefined : '4 4'}
                opacity={isValidPath ? 1 : 0.6}
              />
            );
          }
        }
      });
    });
    return edges;
  };

  // Get node fill color based on type
  const getNodeColor = (nodeId: string) => {
    if (nodeId === 'kanyakumari') return '#f97316'; // Start - orange
    if (fairyNodeId === nodeId) return '#ec4899'; // Fairy - pink
    if (treasureNodeIds.includes(nodeId)) return '#eab308'; // Treasure - yellow
    if (shopNodeIds.includes(nodeId)) return '#8b5cf6'; // Shop - purple
    return '#3b82f6'; // Regular - blue
  };

  // Check if node is a valid move target
  const isValidMove = (nodeId: string) => validMoves.includes(nodeId);

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-b from-sky-50 to-sky-100 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 800"
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-0 left-0"
      >
        {/* Background */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {renderEdges()}

        {/* Nodes */}
        {INDIA_MAP.map((node) => {
          const isValid = isValidMove(node.id);
          const isFairy = fairyNodeId === node.id;
          const isTreasure = treasureNodeIds.includes(node.id);
          const isShop = shopNodeIds.includes(node.id);
          const isStart = node.nodeType === 'START';

          return (
            <g
              key={node.id}
              onClick={() => isValid && onNodeClick(node.id)}
              className={`${isValid ? 'cursor-pointer' : ''}`}
            >
              {/* Valid move glow effect */}
              {isValid && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill="url(#nodeGlow)"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', repeatType: 'reverse' }}
                />
              )}

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isValid ? 12 : 8}
                fill={getNodeColor(node.id)}
                stroke="white"
                strokeWidth={2}
                className={`transition-all ${isValid ? 'drop-shadow-lg' : ''}`}
              />

              {/* Node label */}
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                className="text-[7px] font-medium fill-slate-600 pointer-events-none select-none"
              >
                {node.name}
              </text>

              {/* Special icons */}
              {isFairy && (
                <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize={10}>
                  🧚
                </text>
              )}
              {isTreasure && (
                <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize={10}>
                  💎
                </text>
              )}
              {isShop && !isFairy && !isTreasure && (
                <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize={10}>
                  🏪
                </text>
              )}
              {isStart && !isFairy && !isTreasure && (
                <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize={10}>
                  🚩
                </text>
              )}
            </g>
          );
        })}

        {/* Players */}
        {players.map((player) => {
          const node = getNode(player.currentNodeId);
          if (!node) return null;

          // Offset players if on same node
          const playersOnSameNode = players.filter(p => p.currentNodeId === player.currentNodeId);
          const myIndex = playersOnSameNode.findIndex(p => p.id === player.id);
          const offsetAngle = (myIndex * 90) * (Math.PI / 180);
          const offsetDistance = playersOnSameNode.length > 1 ? 12 : 0;
          const offsetX = Math.cos(offsetAngle) * offsetDistance;
          const offsetY = Math.sin(offsetAngle) * offsetDistance;

          const isMe = player.id === currentPlayerId;

          return (
            <motion.g
              key={player.id}
              initial={{ x: node.x + offsetX, y: node.y + offsetY }}
              animate={{ x: node.x + offsetX, y: node.y + offsetY }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Player indicator ring for current turn */}
              {player.isTurn && (
                <motion.circle
                  cx={0}
                  cy={0}
                  r={18}
                  fill="none"
                  stroke={player.color}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  style={{ transformOrigin: '0 0' }}
                />
              )}

              {/* Player token */}
              <circle
                cx={0}
                cy={0}
                r={isMe ? 12 : 10}
                fill={player.color}
                stroke="white"
                strokeWidth={isMe ? 3 : 2}
                className="drop-shadow-md"
              />

              {/* Player initial */}
              <text
                x={0}
                y={4}
                textAnchor="middle"
                className="text-[10px] font-bold fill-white pointer-events-none select-none"
              >
                {player.name.charAt(0).toUpperCase()}
              </text>

              {/* Star count badge */}
              {player.stars > 0 && (
                <g transform="translate(8, -8)">
                  <circle cx={0} cy={0} r={7} fill="#eab308" stroke="white" strokeWidth={1} />
                  <text x={0} y={3} textAnchor="middle" className="text-[8px] font-bold fill-white">
                    {player.stars}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-xl p-3 shadow-lg text-xs">
        <div className="font-semibold mb-2">Legend</div>
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
    </div>
  );
};
