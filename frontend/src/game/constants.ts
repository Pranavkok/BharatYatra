import type { GameNode } from './types';

// Complete India map with node types
export const INDIA_MAP: GameNode[] = [
  // South India
  { id: 'kanyakumari', name: 'Kanyakumari', x: 200, y: 750, region: 'Tamil Nadu', neighbors: ['chennai', 'madurai', 'trivandrum'], nodeType: 'START' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', x: 150, y: 720, region: 'Kerala', neighbors: ['kanyakumari', 'kochi'], nodeType: 'REGULAR' },
  { id: 'kochi', name: 'Kochi', x: 140, y: 680, region: 'Kerala', neighbors: ['trivandrum', 'bangalore', 'mysore'], nodeType: 'SHOP' },
  { id: 'madurai', name: 'Madurai', x: 210, y: 700, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'chennai', 'coimbatore'], nodeType: 'REGULAR' },
  { id: 'coimbatore', name: 'Coimbatore', x: 185, y: 665, region: 'Tamil Nadu', neighbors: ['madurai', 'mysore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'mysore', name: 'Mysore', x: 200, y: 630, region: 'Karnataka', neighbors: ['kochi', 'coimbatore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'chennai', name: 'Chennai', x: 280, y: 650, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'madurai', 'bangalore', 'hyderabad', 'visakhapatnam'], nodeType: 'SHOP' },
  { id: 'bangalore', name: 'Bangalore', x: 220, y: 600, region: 'Karnataka', neighbors: ['mysore', 'coimbatore', 'chennai', 'hyderabad', 'goa'], nodeType: 'REGULAR' },

  // West India
  { id: 'goa', name: 'Goa', x: 140, y: 540, region: 'Goa', neighbors: ['bangalore', 'mumbai'], nodeType: 'REGULAR' },
  { id: 'mumbai', name: 'Mumbai', x: 120, y: 450, region: 'Maharashtra', neighbors: ['goa', 'pune', 'ahmedabad', 'nagpur'], nodeType: 'SHOP' },
  { id: 'pune', name: 'Pune', x: 150, y: 490, region: 'Maharashtra', neighbors: ['mumbai', 'hyderabad', 'nagpur'], nodeType: 'REGULAR' },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 80, y: 350, region: 'Gujarat', neighbors: ['mumbai', 'jaipur', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'udaipur', name: 'Udaipur', x: 100, y: 300, region: 'Rajasthan', neighbors: ['ahmedabad', 'jaipur'], nodeType: 'REGULAR' },

  // Central India
  { id: 'hyderabad', name: 'Hyderabad', x: 250, y: 530, region: 'Telangana', neighbors: ['chennai', 'bangalore', 'pune', 'nagpur', 'visakhapatnam'], nodeType: 'REGULAR' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', x: 320, y: 520, region: 'Andhra Pradesh', neighbors: ['chennai', 'hyderabad', 'bhubaneswar'], nodeType: 'REGULAR' },
  { id: 'nagpur', name: 'Nagpur', x: 220, y: 420, region: 'Maharashtra', neighbors: ['mumbai', 'pune', 'hyderabad', 'bhopal', 'raipur'], nodeType: 'REGULAR' },
  { id: 'bhopal', name: 'Bhopal', x: 180, y: 350, region: 'Madhya Pradesh', neighbors: ['nagpur', 'jaipur', 'lucknow', 'indore'], nodeType: 'SHOP' },
  { id: 'indore', name: 'Indore', x: 140, y: 380, region: 'Madhya Pradesh', neighbors: ['bhopal', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'raipur', name: 'Raipur', x: 280, y: 400, region: 'Chhattisgarh', neighbors: ['nagpur', 'bhubaneswar'], nodeType: 'REGULAR' },

  // East India
  { id: 'bhubaneswar', name: 'Bhubaneswar', x: 350, y: 420, region: 'Odisha', neighbors: ['visakhapatnam', 'raipur', 'kolkata'], nodeType: 'REGULAR' },
  { id: 'kolkata', name: 'Kolkata', x: 380, y: 340, region: 'West Bengal', neighbors: ['bhubaneswar', 'patna', 'guwahati'], nodeType: 'SHOP' },
  { id: 'patna', name: 'Patna', x: 320, y: 280, region: 'Bihar', neighbors: ['kolkata', 'varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'guwahati', name: 'Guwahati', x: 420, y: 260, region: 'Assam', neighbors: ['kolkata', 'shillong'], nodeType: 'REGULAR' },
  { id: 'shillong', name: 'Shillong', x: 440, y: 280, region: 'Meghalaya', neighbors: ['guwahati'], nodeType: 'REGULAR' },

  // North India
  { id: 'varanasi', name: 'Varanasi', x: 280, y: 260, region: 'Uttar Pradesh', neighbors: ['patna', 'lucknow', 'allahabad'], nodeType: 'REGULAR' },
  { id: 'allahabad', name: 'Prayagraj', x: 260, y: 280, region: 'Uttar Pradesh', neighbors: ['varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'lucknow', name: 'Lucknow', x: 240, y: 230, region: 'Uttar Pradesh', neighbors: ['bhopal', 'patna', 'varanasi', 'allahabad', 'delhi', 'agra'], nodeType: 'REGULAR' },
  { id: 'agra', name: 'Agra', x: 200, y: 220, region: 'Uttar Pradesh', neighbors: ['lucknow', 'delhi', 'jaipur'], nodeType: 'REGULAR' },
  { id: 'jaipur', name: 'Jaipur', x: 140, y: 250, region: 'Rajasthan', neighbors: ['udaipur', 'ahmedabad', 'bhopal', 'agra', 'delhi'], nodeType: 'SHOP' },
  { id: 'delhi', name: 'New Delhi', x: 175, y: 180, region: 'Delhi', neighbors: ['jaipur', 'agra', 'lucknow', 'chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'chandigarh', name: 'Chandigarh', x: 160, y: 140, region: 'Punjab', neighbors: ['delhi', 'amritsar', 'shimla'], nodeType: 'REGULAR' },
  { id: 'amritsar', name: 'Amritsar', x: 130, y: 110, region: 'Punjab', neighbors: ['chandigarh', 'srinagar'], nodeType: 'REGULAR' },

  // Hill Stations & North
  { id: 'shimla', name: 'Shimla', x: 180, y: 120, region: 'Himachal Pradesh', neighbors: ['chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'dehradun', name: 'Dehradun', x: 200, y: 140, region: 'Uttarakhand', neighbors: ['delhi', 'shimla'], nodeType: 'REGULAR' },
  { id: 'srinagar', name: 'Srinagar', x: 140, y: 50, region: 'Kashmir', neighbors: ['amritsar'], nodeType: 'REGULAR' },
];

// Helper to get node by ID
export function getNode(nodeId: string): GameNode | undefined {
  return INDIA_MAP.find(n => n.id === nodeId);
}

// Helper to check if a move is valid
export function isValidMove(currentNodeId: string, targetNodeId: string): boolean {
  const node = getNode(currentNodeId);
  return node ? node.neighbors.includes(targetNodeId) : false;
}
