import type { GameNode } from './types';

// Complete India map with node types
export const INDIA_MAP: GameNode[] = [
  // South India
  { id: 'kanyakumari', name: 'Kanyakumari', x: 400, y: 920, region: 'Tamil Nadu', neighbors: ['chennai', 'madurai', 'trivandrum'], nodeType: 'START' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', x: 340, y: 880, region: 'Kerala', neighbors: ['kanyakumari', 'kochi'], nodeType: 'REGULAR' },
  { id: 'kochi', name: 'Kochi', x: 320, y: 830, region: 'Kerala', neighbors: ['trivandrum', 'bangalore', 'mysore'], nodeType: 'SHOP' },
  { id: 'madurai', name: 'Madurai', x: 410, y: 850, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'chennai', 'coimbatore'], nodeType: 'REGULAR' },
  { id: 'coimbatore', name: 'Coimbatore', x: 380, y: 810, region: 'Tamil Nadu', neighbors: ['madurai', 'mysore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'mysore', name: 'Mysore', x: 390, y: 770, region: 'Karnataka', neighbors: ['kochi', 'coimbatore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'chennai', name: 'Chennai', x: 490, y: 780, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'madurai', 'bangalore', 'hyderabad', 'visakhapatnam'], nodeType: 'SHOP' },
  { id: 'bangalore', name: 'Bangalore', x: 430, y: 720, region: 'Karnataka', neighbors: ['mysore', 'coimbatore', 'chennai', 'hyderabad', 'goa'], nodeType: 'REGULAR' },

  // West India
  { id: 'goa', name: 'Goa', x: 280, y: 660, region: 'Goa', neighbors: ['bangalore', 'mumbai'], nodeType: 'REGULAR' },
  { id: 'mumbai', name: 'Mumbai', x: 260, y: 560, region: 'Maharashtra', neighbors: ['goa', 'pune', 'ahmedabad', 'nagpur'], nodeType: 'SHOP' },
  { id: 'pune', name: 'Pune', x: 300, y: 600, region: 'Maharashtra', neighbors: ['mumbai', 'hyderabad', 'nagpur'], nodeType: 'REGULAR' },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 180, y: 420, region: 'Gujarat', neighbors: ['mumbai', 'jaipur', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'udaipur', name: 'Udaipur', x: 220, y: 380, region: 'Rajasthan', neighbors: ['ahmedabad', 'jaipur'], nodeType: 'REGULAR' },

  // Central India
  { id: 'hyderabad', name: 'Hyderabad', x: 480, y: 640, region: 'Telangana', neighbors: ['chennai', 'bangalore', 'pune', 'nagpur', 'visakhapatnam'], nodeType: 'REGULAR' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', x: 570, y: 620, region: 'Andhra Pradesh', neighbors: ['chennai', 'hyderabad', 'bhubaneswar'], nodeType: 'REGULAR' },
  { id: 'nagpur', name: 'Nagpur', x: 450, y: 520, region: 'Maharashtra', neighbors: ['mumbai', 'pune', 'hyderabad', 'bhopal', 'raipur'], nodeType: 'REGULAR' },
  { id: 'bhopal', name: 'Bhopal', x: 390, y: 470, region: 'Madhya Pradesh', neighbors: ['nagpur', 'jaipur', 'lucknow', 'indore'], nodeType: 'SHOP' },
  { id: 'indore', name: 'Indore', x: 320, y: 480, region: 'Madhya Pradesh', neighbors: ['bhopal', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'raipur', name: 'Raipur', x: 550, y: 500, region: 'Chhattisgarh', neighbors: ['nagpur', 'bhubaneswar'], nodeType: 'REGULAR' },

  // East India
  { id: 'bhubaneswar', name: 'Bhubaneswar', x: 670, y: 530, region: 'Odisha', neighbors: ['visakhapatnam', 'raipur', 'kolkata'], nodeType: 'REGULAR' },
  { id: 'kolkata', name: 'Kolkata', x: 730, y: 440, region: 'West Bengal', neighbors: ['bhubaneswar', 'patna', 'guwahati'], nodeType: 'SHOP' },
  { id: 'patna', name: 'Patna', x: 630, y: 370, region: 'Bihar', neighbors: ['kolkata', 'varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'guwahati', name: 'Guwahati', x: 810, y: 340, region: 'Assam', neighbors: ['kolkata', 'shillong'], nodeType: 'REGULAR' },
  { id: 'shillong', name: 'Shillong', x: 840, y: 360, region: 'Meghalaya', neighbors: ['guwahati'], nodeType: 'REGULAR' },

  // North India
  { id: 'varanasi', name: 'Varanasi', x: 560, y: 350, region: 'Uttar Pradesh', neighbors: ['patna', 'lucknow', 'allahabad'], nodeType: 'REGULAR' },
  { id: 'allahabad', name: 'Prayagraj', x: 530, y: 370, region: 'Uttar Pradesh', neighbors: ['varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'lucknow', name: 'Lucknow', x: 490, y: 320, region: 'Uttar Pradesh', neighbors: ['bhopal', 'patna', 'varanasi', 'allahabad', 'delhi', 'agra'], nodeType: 'REGULAR' },
  { id: 'agra', name: 'Agra', x: 430, y: 310, region: 'Uttar Pradesh', neighbors: ['lucknow', 'delhi', 'jaipur'], nodeType: 'REGULAR' },
  { id: 'jaipur', name: 'Jaipur', x: 330, y: 330, region: 'Rajasthan', neighbors: ['udaipur', 'ahmedabad', 'bhopal', 'agra', 'delhi'], nodeType: 'SHOP' },
  { id: 'delhi', name: 'New Delhi', x: 380, y: 270, region: 'Delhi', neighbors: ['jaipur', 'agra', 'lucknow', 'chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'chandigarh', name: 'Chandigarh', x: 360, y: 210, region: 'Punjab', neighbors: ['delhi', 'amritsar', 'shimla'], nodeType: 'REGULAR' },
  { id: 'amritsar', name: 'Amritsar', x: 310, y: 180, region: 'Punjab', neighbors: ['chandigarh', 'srinagar'], nodeType: 'REGULAR' },

  // Hill Stations & North
  { id: 'shimla', name: 'Shimla', x: 390, y: 190, region: 'Himachal Pradesh', neighbors: ['chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'dehradun', name: 'Dehradun', x: 420, y: 210, region: 'Uttarakhand', neighbors: ['delhi', 'shimla'], nodeType: 'REGULAR' },
  { id: 'srinagar', name: 'Srinagar', x: 310, y: 100, region: 'Kashmir', neighbors: ['amritsar'], nodeType: 'REGULAR' },
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
