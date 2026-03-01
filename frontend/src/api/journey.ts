export interface JourneyRequest {
  id: number;
  name: string;
  email: string;
  destination: string;
  travelers: number;
  travelMonth: string;
  notes: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:3000';

export async function fetchJourneyRequests(): Promise<JourneyRequest[]> {
  const response = await fetch(`${API_BASE}/api/journey-requests`);

  if (!response.ok) {
    throw new Error('Failed to load journey requests.');
  }

  const payload = await response.json();
  return payload.data ?? [];
}

interface JourneyRequestInput {
  name: string;
  email: string;
  destination: string;
  travelers: number;
  travelMonth: string;
  notes: string;
}

export async function submitJourneyRequest(input: JourneyRequestInput): Promise<JourneyRequest> {
  const response = await fetch(`${API_BASE}/api/journey-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to submit request.');
  }

  return payload.data;
}
