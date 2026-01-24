import type { GameNode } from './types';

// Complete India map with node types
export const INDIA_MAP: GameNode[] = [
  // South India
  { id: 'kanyakumari', name: 'Kanyakumari', x: 340, y: 960, region: 'Tamil Nadu', neighbors: ['chennai', 'madurai', 'trivandrum'], nodeType: 'START' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', x: 314, y: 930, region: 'Kerala', neighbors: ['kanyakumari', 'kochi'], nodeType: 'REGULAR' },
  { id: 'kochi', name: 'Kochi', x: 305, y: 890, region: 'Kerala', neighbors: ['trivandrum', 'bangalore', 'mysore'], nodeType: 'SHOP' },
  { id: 'madurai', name: 'Madurai', x: 360, y: 906, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'chennai', 'coimbatore'], nodeType: 'REGULAR' },
  { id: 'coimbatore', name: 'Coimbatore', x: 327, y: 864, region: 'Tamil Nadu', neighbors: ['madurai', 'mysore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'mysore', name: 'Mysore', x: 310, y: 820, region: 'Karnataka', neighbors: ['kochi', 'coimbatore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'chennai', name: 'Chennai', x: 413, y: 813, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'madurai', 'bangalore', 'hyderabad', 'visakhapatnam'], nodeType: 'SHOP' },
  { id: 'bangalore', name: 'Bangalore', x: 338, y: 810, region: 'Karnataka', neighbors: ['mysore', 'coimbatore', 'chennai', 'hyderabad', 'goa'], nodeType: 'REGULAR' },

  // West India
  { id: 'goa', name: 'Goa', x: 235, y: 740, region: 'Goa', neighbors: ['bangalore', 'mumbai'], nodeType: 'REGULAR' },
  { id: 'mumbai', name: 'Mumbai', x: 208, y: 620, region: 'Maharashtra', neighbors: ['goa', 'pune', 'ahmedabad', 'nagpur'], nodeType: 'SHOP' },
  { id: 'pune', name: 'Pune', x: 250, y: 660, region: 'Maharashtra', neighbors: ['mumbai', 'hyderabad', 'nagpur'], nodeType: 'REGULAR' },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 190, y: 497, region: 'Gujarat', neighbors: ['mumbai', 'jaipur', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'udaipur', name: 'Udaipur', x: 220, y: 435, region: 'Rajasthan', neighbors: ['ahmedabad', 'jaipur'], nodeType: 'REGULAR' },

  // Central India
  { id: 'hyderabad', name: 'Hyderabad', x: 375, y: 660, region: 'Telangana', neighbors: ['chennai', 'bangalore', 'pune', 'nagpur', 'visakhapatnam'], nodeType: 'REGULAR' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', x: 510, y: 660, region: 'Andhra Pradesh', neighbors: ['chennai', 'hyderabad', 'bhubaneswar'], nodeType: 'REGULAR' },
  { id: 'nagpur', name: 'Nagpur', x: 380, y: 560, region: 'Maharashtra', neighbors: ['mumbai', 'pune', 'hyderabad', 'bhopal', 'raipur'], nodeType: 'REGULAR' },
  { id: 'bhopal', name: 'Bhopal', x: 320, y: 480, region: 'Madhya Pradesh', neighbors: ['nagpur', 'jaipur', 'lucknow', 'indore'], nodeType: 'SHOP' },
  { id: 'indore', name: 'Indore', x: 295, y: 515, region: 'Madhya Pradesh', neighbors: ['bhopal', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'raipur', name: 'Raipur', x: 470, y: 550, region: 'Chhattisgarh', neighbors: ['nagpur', 'bhubaneswar'], nodeType: 'REGULAR' },

  // East India
  { id: 'bhubaneswar', name: 'Bhubaneswar', x: 580, y: 580, region: 'Odisha', neighbors: ['visakhapatnam', 'raipur', 'kolkata'], nodeType: 'REGULAR' },
  { id: 'kolkata', name: 'Kolkata', x: 660, y: 500, region: 'West Bengal', neighbors: ['bhubaneswar', 'patna', 'guwahati'], nodeType: 'SHOP' },
  { id: 'patna', name: 'Patna', x: 580, y: 400, region: 'Bihar', neighbors: ['kolkata', 'varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'guwahati', name: 'Guwahati', x: 770, y: 375, region: 'Assam', neighbors: ['kolkata', 'shillong'], nodeType: 'REGULAR' },
  { id: 'shillong', name: 'Shillong', x: 760, y: 410, region: 'Meghalaya', neighbors: ['guwahati'], nodeType: 'REGULAR' },

  // North India
  { id: 'varanasi', name: 'Varanasi', x: 500, y: 420, region: 'Uttar Pradesh', neighbors: ['patna', 'lucknow', 'allahabad'], nodeType: 'REGULAR' },
  { id: 'allahabad', name: 'Prayagraj', x: 450, y: 405, region: 'Uttar Pradesh', neighbors: ['varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'lucknow', name: 'Lucknow', x: 450, y: 360, region: 'Uttar Pradesh', neighbors: ['bhopal', 'patna', 'varanasi', 'allahabad', 'delhi', 'agra'], nodeType: 'REGULAR' },
  { id: 'agra', name: 'Agra', x: 370, y: 340, region: 'Uttar Pradesh', neighbors: ['lucknow', 'delhi', 'jaipur'], nodeType: 'REGULAR' },
  { id: 'jaipur', name: 'Jaipur', x: 280, y: 380, region: 'Rajasthan', neighbors: ['udaipur', 'ahmedabad', 'bhopal', 'agra', 'delhi'], nodeType: 'SHOP' },
  { id: 'delhi', name: 'New Delhi', x: 329, y: 300, region: 'Delhi', neighbors: ['jaipur', 'agra', 'lucknow', 'chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'chandigarh', name: 'Chandigarh', x: 320, y: 250, region: 'Punjab', neighbors: ['delhi', 'amritsar', 'shimla'], nodeType: 'REGULAR' },
  { id: 'amritsar', name: 'Amritsar', x: 265, y: 220, region: 'Punjab', neighbors: ['chandigarh', 'srinagar'], nodeType: 'REGULAR' },

  // Hill Stations & North
  { id: 'shimla', name: 'Shimla', x: 335, y: 200, region: 'Himachal Pradesh', neighbors: ['chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'dehradun', name: 'Dehradun', x: 370, y: 230, region: 'Uttarakhand', neighbors: ['delhi', 'shimla'], nodeType: 'REGULAR' },
  { id: 'srinagar', name: 'Srinagar', x: 250, y: 90, region: 'Kashmir', neighbors: ['amritsar'], nodeType: 'REGULAR' },
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
