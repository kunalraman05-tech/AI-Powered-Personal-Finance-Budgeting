/**
 * AI Categorizer Engine
 * Uses keyword matching and heuristics to automatically categorize transactions
 * based on their description and amount.
 */

export interface CategorizationResult {
  category: string;
  confidence: 'high' | 'medium' | 'low';
  method: 'keyword' | 'amount' | 'default';
}

// Comprehensive keyword database for common merchants and categories
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Groceries': [
    'grocery', 'supermarket', 'market', 'walmart', 'target', 'costco', 
    'kroger', 'safeway', 'aldi', 'whole foods', 'trader joe', 'publix',
    'food lion', 'h-e-b', 'wegmans', 'stop & shop', 'fresh thyme',
    'sprouts', 'food', 'bakery', 'butcher'
  ],
  'Dining': [
    'restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'burger king',
    'subway', 'pizza', 'sushi', 'doordash', 'uber eats', 'grubhub',
    'postmates', 'chipotle', 'taco bell', 'kfc', 'wendys', 'dunkin',
    'panera', 'chick-fil-a', 'olive garden', 'chilis', 'applebees',
    'bar', 'grill', 'bistro', 'eatery', 'diner', 'lunch', 'dinner'
  ],
  'Transportation': [
    'uber', 'lyft', 'taxi', 'gas', 'shell', 'chevron', 'bp', 'exxon',
    'mobil', 'parking', 'metro', 'bus', 'train', 'subway', 'airline',
    'delta', 'united', 'southwest', 'jetblue', 'american air', 'amtrak',
    'greyhound', 'car rental', 'enterprise', 'hertz', 'avis', 'zipcar',
    'toll', 'ez-pass', 'transit', 'commute'
  ],
  'Utilities': [
    'electric', 'water', 'gas', 'internet', 'verizon', 'at&t', 'comcast',
    'spectrum', 'utility', 'power', 'energy', 'con edison', 'pg&e',
    'duke energy', 'city of', 'sewer', 'sanitation', 'trash', 'waste',
    'mobile', 'wireless', 'phone', 'broadband', 'fiber'
  ],
  'Entertainment': [
    'netflix', 'hulu', 'disney+', 'spotify', 'apple music', 'amazon prime',
    'movie', 'theater', 'concert', 'game', 'playstation', 'xbox', 'steam',
    'nintendo', 'espn', 'hbo', 'showtime', 'youtube', 'tiktok', 'twitch',
    'event', 'ticket', 'sports', 'league', 'gaming', 'entertainment'
  ],
  'Shopping': [
    'amazon', 'ebay', 'etsy', 'walmart', 'target', 'best buy', 'nike',
    'zara', 'h&m', 'clothing', 'shoes', 'apparel', 'retail', 'store',
    'mall', 'shop', 'purchase', 'order', 'merchandise', 'ikea', 'cvs',
    'walgreens', 'costco', 'sams club', 'bj\'s'
  ],
  'Health': [
    'cvs', 'walgreens', 'pharmacy', 'doctor', 'dentist', 'hospital',
    'medical', 'insurance', 'fitness', 'gym', 'health', 'wellness',
    'clinic', 'urgent care', 'prescription', 'drug', 'medication',
    'therapy', 'chiropractor', 'veterinary', 'pet'
  ],
  'Housing': [
    'rent', 'apartment', 'landlord', 'mortgage', 'housing', 'realtor',
    'zillow', 'airbnb', 'hotel', 'lodging', 'accommodation', 'lease',
    'property management', 'hoa', 'maintenance', 'repair'
  ],
  'Income': [
    'salary', 'payroll', 'adp', 'direct deposit', 'income', 'pay',
    'transfer in', 'deposit', 'irs', 'treasury', 'refund', 'dividend',
    'interest', 'investment', 'freelance', 'upwork', 'fiverr'
  ]
};

// Fallback categories for amount-based heuristics
const AMOUNT_HEURISTICS = [
  { min: 800, max: 3000, category: 'Housing' },
  { min: 100, max: 500, category: 'Utilities' },
  { min: 5, max: 50, category: 'Dining' },
  { min: 10, max: 200, category: 'Groceries' },
];

export function categorizeTransaction(
  description: string, 
  amount: number, 
  type: 'income' | 'expense'
): CategorizationResult {
  const desc = description.toLowerCase().trim();

  // 1. Explicit Type Check
  if (type === 'income') {
    const incomeKeywords = CATEGORY_KEYWORDS['Income'];
    if (incomeKeywords.some(k => desc.includes(k))) {
      return { category: 'Salary', confidence: 'high', method: 'keyword' };
    }
    return { category: 'Freelance', confidence: 'medium', method: 'default' };
  }

  // 2. Keyword Matching (High Confidence)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Income') continue; // Skip income keywords for expenses
    
    // Check for exact phrase matches first
    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        return { category, confidence: 'high', method: 'keyword' };
      }
    }
  }

  // 3. Amount-Based Heuristics (Medium Confidence)
  for (const heuristic of AMOUNT_HEURISTICS) {
    if (amount >= heuristic.min && amount <= heuristic.max) {
      return { category: heuristic.category, confidence: 'medium', method: 'amount' };
    }
  }

  // 4. Fallback (Low Confidence)
  return { category: 'Other', confidence: 'low', method: 'default' };
}