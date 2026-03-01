import { Router } from "express";

interface JourneyRequest {
  id: number;
  name: string;
  email: string;
  destination: string;
  travelers: number;
  travelMonth: string;
  notes: string;
  createdAt: string;
}

const journeyRequests: JourneyRequest[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    destination: "Jaipur",
    travelers: 2,
    travelMonth: "March",
    notes: "Looking for a heritage and food-focused route.",
    createdAt: new Date("2026-01-12T09:30:00.000Z").toISOString(),
  },
  {
    id: 2,
    name: "Meera Nair",
    email: "meera@example.com",
    destination: "Kochi",
    travelers: 4,
    travelMonth: "November",
    notes: "Family trip with kids; prefer relaxed itinerary.",
    createdAt: new Date("2026-01-14T15:20:00.000Z").toISOString(),
  },
];

let nextId = journeyRequests.length + 1;

const router = Router();

router.get("/", (_req, res) => {
  const sorted = [...journeyRequests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  res.json({ data: sorted });
});

router.post("/", (req, res) => {
  const { name, email, destination, travelers, travelMonth, notes } = req.body;

  if (!name || !email || !destination || !travelMonth || !notes) {
    return res.status(400).json({
      message: "Please fill all required fields.",
    });
  }

  const parsedTravelers = Number(travelers);
  if (!Number.isInteger(parsedTravelers) || parsedTravelers < 1 || parsedTravelers > 20) {
    return res.status(400).json({
      message: "Travelers must be a whole number between 1 and 20.",
    });
  }

  const newRequest: JourneyRequest = {
    id: nextId++,
    name: String(name).trim(),
    email: String(email).trim(),
    destination: String(destination).trim(),
    travelers: parsedTravelers,
    travelMonth: String(travelMonth).trim(),
    notes: String(notes).trim(),
    createdAt: new Date().toISOString(),
  };

  journeyRequests.push(newRequest);

  return res.status(201).json({
    message: "Journey request submitted successfully.",
    data: newRequest,
  });
});

export default router;
