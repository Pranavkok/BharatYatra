import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
}

export const generateQuiz = async (cityName: string, region: string): Promise<QuizData> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a fun, educational multiple-choice question about ${cityName}, ${region}, India.
The question should be about one of these topics: culture, traditions, festivals, food, history, geography, or famous landmarks.
Make it interesting and not too difficult.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{"question": "Your question here?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0}

The correctIndex should be 0, 1, 2, or 3 indicating which option is correct.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any markdown formatting
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(jsonStr);

    // Validate the response structure
    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4 || typeof parsed.correctIndex !== 'number') {
      throw new Error('Invalid quiz format');
    }

    return {
      question: parsed.question,
      options: parsed.options,
      correctIndex: parsed.correctIndex
    };
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    // Fallback quiz
    return getFallbackQuiz(cityName, region);
  }
};

export const generateRegionInfo = async (cityName: string, region: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a brief, engaging description of ${cityName}, ${region}, India for a board game player.
Include 2-3 interesting facts about:
- Culture and traditions
- Famous festivals
- Local food specialties
- Historical significance

Keep it concise (max 150 words), friendly, and educational. Use simple language.
Do not use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Region Info Error:", error);
    return getFallbackRegionInfo(cityName, region);
  }
};

// Fallback quizzes when Gemini fails
function getFallbackQuiz(cityName: string, region: string): QuizData {
  const fallbackQuizzes: Record<string, QuizData[]> = {
    'Tamil Nadu': [
      {
        question: `What is ${cityName} famous for?`,
        options: ["Temples", "Beaches", "Mountains", "Deserts"],
        correctIndex: 0
      },
      {
        question: "What is the traditional dance form of Tamil Nadu?",
        options: ["Bharatanatyam", "Kathak", "Odissi", "Kuchipudi"],
        correctIndex: 0
      }
    ],
    'Kerala': [
      {
        question: "What is Kerala known as?",
        options: ["God's Own Country", "Land of Kings", "City of Joy", "Pink City"],
        correctIndex: 0
      },
      {
        question: "What is the famous boat race of Kerala called?",
        options: ["Vallam Kali", "Dragon Race", "Regatta", "Kayak Race"],
        correctIndex: 0
      }
    ],
    'Karnataka': [
      {
        question: "What is Bangalore known as?",
        options: ["Silicon Valley of India", "City of Lakes", "City of Joy", "Pink City"],
        correctIndex: 0
      },
      {
        question: "What is the famous festival celebrated in Mysore?",
        options: ["Dussehra", "Diwali", "Holi", "Pongal"],
        correctIndex: 0
      }
    ],
    'Maharashtra': [
      {
        question: "What is the capital city of Maharashtra?",
        options: ["Mumbai", "Pune", "Nagpur", "Nashik"],
        correctIndex: 0
      },
      {
        question: "What is the famous street food of Mumbai?",
        options: ["Vada Pav", "Samosa", "Pav Bhaji", "All of the above"],
        correctIndex: 3
      }
    ],
    'Gujarat': [
      {
        question: "What is the famous dance of Gujarat?",
        options: ["Garba", "Bharatanatyam", "Kathak", "Bihu"],
        correctIndex: 0
      }
    ],
    'Rajasthan': [
      {
        question: "What is Jaipur also known as?",
        options: ["Pink City", "Blue City", "White City", "Golden City"],
        correctIndex: 0
      },
      {
        question: "What is the famous fort in Rajasthan?",
        options: ["Amber Fort", "Red Fort", "Golconda Fort", "Agra Fort"],
        correctIndex: 0
      }
    ],
    'Delhi': [
      {
        question: "What historical monument is located in Delhi?",
        options: ["Red Fort", "Taj Mahal", "Gateway of India", "Victoria Memorial"],
        correctIndex: 0
      }
    ],
    'Uttar Pradesh': [
      {
        question: "Which famous monument is located in Agra?",
        options: ["Taj Mahal", "Red Fort", "Qutub Minar", "Gateway of India"],
        correctIndex: 0
      },
      {
        question: "What is Varanasi famous for?",
        options: ["Ghats on Ganges", "Beaches", "Hill Stations", "Deserts"],
        correctIndex: 0
      }
    ],
    'West Bengal': [
      {
        question: "What is Kolkata known as?",
        options: ["City of Joy", "Pink City", "Silicon Valley", "Garden City"],
        correctIndex: 0
      },
      {
        question: "What is the famous sweet from Bengal?",
        options: ["Rasgulla", "Jalebi", "Ladoo", "Gulab Jamun"],
        correctIndex: 0
      }
    ],
    'Bihar': [
      {
        question: "Which ancient university was located in Bihar?",
        options: ["Nalanda", "Oxford", "Cambridge", "Harvard"],
        correctIndex: 0
      }
    ],
    'Odisha': [
      {
        question: "What is the famous temple in Bhubaneswar?",
        options: ["Lingaraj Temple", "Meenakshi Temple", "Golden Temple", "Siddhivinayak"],
        correctIndex: 0
      }
    ],
    'Telangana': [
      {
        question: "What is the famous monument in Hyderabad?",
        options: ["Charminar", "Taj Mahal", "Red Fort", "Gateway of India"],
        correctIndex: 0
      },
      {
        question: "What is the famous biryani from Hyderabad called?",
        options: ["Hyderabadi Biryani", "Lucknowi Biryani", "Kolkata Biryani", "Mumbai Biryani"],
        correctIndex: 0
      }
    ],
    'Punjab': [
      {
        question: "What is the holiest shrine for Sikhs located in Amritsar?",
        options: ["Golden Temple", "Red Fort", "Jama Masjid", "Lotus Temple"],
        correctIndex: 0
      }
    ],
    'Assam': [
      {
        question: "What is Assam famous for?",
        options: ["Tea Gardens", "Deserts", "Beaches", "Snow Mountains"],
        correctIndex: 0
      }
    ],
    'Kashmir': [
      {
        question: "What is Kashmir often called?",
        options: ["Paradise on Earth", "God's Own Country", "City of Joy", "Pink City"],
        correctIndex: 0
      }
    ],
    'Goa': [
      {
        question: "What is Goa famous for?",
        options: ["Beaches", "Deserts", "Mountains", "Forests"],
        correctIndex: 0
      }
    ],
    'Madhya Pradesh': [
      {
        question: "What ancient structures are found in Khajuraho, MP?",
        options: ["Temples with sculptures", "Forts", "Mosques", "Churches"],
        correctIndex: 0
      }
    ]
  };

  const regionQuizzes = fallbackQuizzes[region] ?? fallbackQuizzes['Delhi'] ?? [];
  const quiz = regionQuizzes[Math.floor(Math.random() * regionQuizzes.length)];
  return quiz ?? {
    question: `What is ${cityName} known for?`,
    options: ["Culture", "Food", "History", "All of the above"],
    correctIndex: 3
  };
}

function getFallbackRegionInfo(cityName: string, region: string): string {
  const fallbackInfo: Record<string, string> = {
    'Tamil Nadu': `${cityName} is a beautiful city in Tamil Nadu, known for its ancient temples, rich Dravidian culture, and delicious South Indian cuisine including dosa, idli, and filter coffee. The state celebrates Pongal, a harvest festival with great enthusiasm.`,
    'Kerala': `${cityName} in Kerala, God's Own Country, is known for its backwaters, Ayurvedic treatments, and lush greenery. Kerala cuisine features coconut-based dishes and seafood. The state is famous for Onam festival and Kathakali dance.`,
    'Karnataka': `${cityName} in Karnataka blends tradition with modernity. Known for its silk sarees, Mysore Pak sweets, and classical Carnatic music. Dussehra is celebrated grandly here with the famous Mysore Palace illuminations.`,
    'Maharashtra': `${cityName} in Maharashtra is a hub of culture and commerce. Famous for Marathi theatre, Vada Pav, and the vibrant Ganesh Chaturthi celebrations. The state has many historic forts and caves.`,
    'Gujarat': `${cityName} in Gujarat is known for its vibrant culture, vegetarian cuisine, and the colorful Navratri Garba festival. The state is famous for its textiles and the historic Sabarmati Ashram.`,
    'Rajasthan': `${cityName} in Rajasthan showcases royal heritage with magnificent forts and palaces. Known for its desert culture, folk music, and delicious Dal Baati Churma. The state is colorful and rich in traditions.`,
    'Delhi': `${cityName} is India's capital, a blend of ancient history and modern development. Home to Red Fort, India Gate, and diverse food from across the country. The city has witnessed many empires and cultures.`,
    'default': `${cityName} in ${region} is a wonderful destination with unique culture, delicious local cuisine, and rich traditions. Each region of India has its own festivals, art forms, and historical significance that make it special.`
  };

  return fallbackInfo[region] ?? fallbackInfo['default'] ?? `${cityName} in ${region} is a wonderful destination in India.`;
}
