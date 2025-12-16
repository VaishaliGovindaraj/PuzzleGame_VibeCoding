const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create a document
const doc = new PDFDocument({
  size: 'A4',
  margins: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  }
});

// Pipe to a file
doc.pipe(fs.createWriteStream('SkillSprout_Code_Documentation.pdf'));

// Helper functions
function addPageHeader(title) {
  doc.fontSize(24)
     .fillColor('#8B5CF6')
     .text(title, { align: 'center' })
     .moveDown(0.5);

  doc.moveTo(50, doc.y)
     .lineTo(545, doc.y)
     .strokeColor('#E9D5FF')
     .lineWidth(2)
     .stroke();

  doc.moveDown(1);
}

function addCodeBlock(title, code, description = '') {
  if (doc.y > 650) {
    doc.addPage();
  }

  doc.fontSize(14)
     .fillColor('#4B5563')
     .font('Helvetica-Bold')
     .text(title, { underline: true })
     .moveDown(0.3);

  if (description) {
    doc.fontSize(10)
       .fillColor('#6B7280')
       .font('Helvetica')
       .text(description)
       .moveDown(0.5);
  }

  doc.fontSize(9)
     .fillColor('#1F2937')
     .font('Courier')
     .fillAndStroke('#F3F4F6', '#E5E7EB')
     .rect(doc.x - 5, doc.y - 5, 495, 10)
     .fill();

  doc.fillColor('#059669')
     .text(code, {
       width: 485,
       lineGap: 2
     })
     .moveDown(1);

  doc.fillColor('#4B5563').font('Helvetica');
}

function addSection(title, content) {
  if (doc.y > 700) {
    doc.addPage();
  }

  doc.fontSize(16)
     .fillColor('#7C3AED')
     .font('Helvetica-Bold')
     .text(title)
     .moveDown(0.5);

  doc.fontSize(11)
     .fillColor('#374151')
     .font('Helvetica')
     .text(content, { align: 'justify' })
     .moveDown(1);
}

function addBulletPoint(text, indent = 0) {
  const bulletX = 50 + (indent * 20);
  const textX = bulletX + 15;

  if (doc.y > 720) {
    doc.addPage();
  }

  doc.fontSize(10)
     .fillColor('#7C3AED')
     .text('•', bulletX, doc.y, { continued: false });

  doc.fillColor('#374151')
     .text(text, textX, doc.y - 10, { width: 495 - (textX - 50) })
     .moveDown(0.3);
}

function addUIDescription(pageName, description, features) {
  if (doc.y > 650) {
    doc.addPage();
  }

  doc.fontSize(14)
     .fillColor('#8B5CF6')
     .font('Helvetica-Bold')
     .text(`📱 ${pageName}`, { underline: true })
     .moveDown(0.5);

  doc.fontSize(11)
     .fillColor('#374151')
     .font('Helvetica')
     .text(description)
     .moveDown(0.5);

  doc.fontSize(10)
     .fillColor('#6B7280')
     .font('Helvetica-Bold')
     .text('Key Features:', { underline: true })
     .moveDown(0.3);

  features.forEach(feature => {
    addBulletPoint(feature);
  });

  doc.moveDown(0.5);
}

// PAGE 1: Cover Page
doc.fontSize(48)
   .fillColor('#8B5CF6')
   .font('Helvetica-Bold')
   .text('🎮 SkillSprout', { align: 'center' })
   .moveDown(0.5);

doc.fontSize(28)
   .fillColor('#EC4899')
   .text('Code Documentation', { align: 'center' })
   .moveDown(2);

doc.fontSize(16)
   .fillColor('#6B7280')
   .font('Helvetica')
   .text('Educational Puzzle Game for Kids', { align: 'center' })
   .moveDown(0.5);

doc.fontSize(14)
   .fillColor('#9CA3AF')
   .text('Ages 3-6', { align: 'center' })
   .moveDown(3);

doc.rect(100, doc.y, 395, 200)
   .fillAndStroke('#F3E8FF', '#C084FC');

doc.fillColor('#6B7280')
   .fontSize(12)
   .text('\n\nTechnology Stack:', 100, doc.y + 20, { width: 395, align: 'center' })
   .moveDown(0.5)
   .text('Next.js 16', { align: 'center' })
   .text('React 19', { align: 'center' })
   .text('TypeScript 5', { align: 'center' })
   .text('Tailwind CSS 4', { align: 'center' })
   .moveDown(2);

doc.fontSize(10)
   .fillColor('#9CA3AF')
   .text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

doc.addPage();

// PAGE 2: Project Overview
addPageHeader('📋 Project Overview');

addSection('About SkillSprout',
  'SkillSprout is an interactive educational puzzle game designed for young children aged 3-6 years. ' +
  'The application provides a fun and engaging way for kids to develop cognitive skills through pattern recognition, ' +
  'shape matching, and logical thinking exercises. Built with modern web technologies, it offers a responsive, ' +
  'child-friendly interface with role-based authentication for administrators, teachers, and parents.'
);

addSection('Key Features',
  'The application includes three main puzzle categories: Patterns, Shape Match, and Logical Thinking. ' +
  'Each category contains age-appropriate puzzles with difficulty levels ranging from 3-4 years to 5-6 years. ' +
  'The system includes real-time scoring, helpful hints, progress tracking, and a beautiful gradient-based UI ' +
  'designed to appeal to young learners.'
);

addSection('Architecture Highlights',
  'Built on Next.js 16 with the App Router, the application uses React Server Components and Client Components ' +
  'strategically. Authentication is managed through React Context with localStorage persistence. The puzzle data ' +
  'is stored in JSON files and filtered dynamically based on user-selected age ranges. Protected routes ensure ' +
  'that only authenticated users can access the game content.'
);

doc.addPage();

// PAGE 3: Authentication System
addPageHeader('🔐 Authentication System');

addSection('Overview',
  'The authentication system is built using React Context API, providing a centralized state management solution ' +
  'for user authentication across the application. It supports three user roles: Administrator, Teacher, and Parent, ' +
  'each with demo credentials for easy testing.'
);

addCodeBlock(
  'AuthContext Implementation',
  `interface User {
  username: string;
  role: string;
}

const validUsers = [
  { username: 'admin', password: 'admin123', role: 'Administrator' },
  { username: 'teacher', password: 'teacher123', role: 'Teacher' },
  { username: 'parent', password: 'parent123', role: 'Parent' },
];`,
  'User types and demo credentials stored in the AuthContext'
);

addCodeBlock(
  'Login Function',
  `const login = (username: string, password: string): boolean => {
  const foundUser = validUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    const userData = { username: foundUser.username, role: foundUser.role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  }
  return false;
};`,
  'Simple but effective authentication with localStorage persistence'
);

addSection('Key Features',
  'The auth system includes automatic redirect after login, localStorage persistence for session management, ' +
  'and a loading state to prevent flash of unauthenticated content.'
);

doc.addPage();

// PAGE 4: Login Page UI
addPageHeader('🎨 Login Page Design');

addUIDescription(
  'Login Page (/login)',
  'A vibrant, child-friendly login interface with a beautiful gradient background transitioning from yellow through pink to purple. ' +
  'The page features the SkillSprout branding with a game controller emoji and welcoming text.',
  [
    'Gradient background: from-yellow-100 via-pink-100 to-purple-100',
    'Centered white card with rounded corners (rounded-3xl) and shadow-2xl',
    'Username and password input fields with purple focus states',
    'Colorful gradient button (purple-500 to pink-500) with hover effects',
    'Toggleable demo credentials section showing all test accounts',
    'Responsive design with mobile-first approach (sm:, md:, lg: breakpoints)',
    'Error messaging with red background for invalid credentials',
    'Auto-redirect to home page when already authenticated'
  ]
);

addCodeBlock(
  'Gradient Button Styling',
  `className="w-full bg-gradient-to-r from-purple-500 to-pink-500
  text-white font-bold text-xl py-4 rounded-xl
  hover:shadow-lg transform hover:scale-105
  active:scale-95 transition-all"`,
  'Modern Tailwind CSS styling with hover animations'
);

addSection('Form Validation',
  'The login form includes client-side validation to ensure both username and password are provided before submission. ' +
  'Error messages are displayed in a prominent red box above the login button, providing clear feedback to users.'
);

doc.addPage();

// PAGE 5: Protected Routes
addPageHeader('🛡️ Protected Route System');

addSection('Route Protection',
  'The ProtectedRoute component ensures that only authenticated users can access puzzle content. ' +
  'It wraps protected pages and automatically redirects unauthenticated users to the login page.'
);

addCodeBlock(
  'ProtectedRoute Component',
  `export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600">
          Redirecting to login...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}`,
  'File: src/components/ProtectedRoute.tsx'
);

addSection('Usage',
  'Every protected page wraps its content with the ProtectedRoute component. This includes the home page ' +
  'and all puzzle category pages, ensuring a consistent authentication barrier across the application.'
);

doc.addPage();

// PAGE 6: Home Page & Category Selection
addPageHeader('🏠 Home Page & Categories');

addUIDescription(
  'Home Page (Main Dashboard)',
  'The main dashboard welcomes authenticated users and allows them to select their age range and choose from three puzzle categories. ' +
  'It features a clean, colorful design with large, touch-friendly buttons perfect for young children.',
  [
    'User welcome banner showing username and role',
    'Logout button in the top-right corner',
    'Age selection buttons (3-4, 4-5, 5-6 years) with active state highlighting',
    'Three category cards: Patterns (🔄), Shape Match (⭐), and Logical Thinking (🧠)',
    'Each category has a unique gradient color scheme',
    'Grid layout that adapts from single column on mobile to 3 columns on large screens',
    'Hover effects with scale transform for interactive feedback',
    'Dynamic routing with age parameter passed to puzzle pages'
  ]
);

addCodeBlock(
  'Category Configuration',
  `const categories = [
  {
    id: 'patterns',
    name: 'Patterns',
    emoji: '🔄',
    description: 'Complete the pattern!',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'shapes_match',
    name: 'Shape Match',
    emoji: '⭐',
    description: 'Find the right shape!',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'logical',
    name: 'Logical Thinking',
    emoji: '🧠',
    description: 'Use your brain!',
    color: 'from-green-400 to-emerald-400'
  }
];`,
  'File: src/app/page.tsx'
);

doc.addPage();

// PAGE 7: Puzzle Data Structure
addPageHeader('📊 Puzzle Data Structure');

addSection('Data Organization',
  'Puzzles are organized in three JSON files (patterns.json, shapes_match.json, logical.json), each containing ' +
  'an array of puzzle objects. Each puzzle includes metadata for age-appropriate filtering and gameplay.'
);

addCodeBlock(
  'Puzzle Interface',
  `export interface Puzzle {
  id: string;
  ageRange: AgeRange;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
}

export type AgeRange = "3-4" | "4-5" | "5-6" | "3-5" | "4-6";`,
  'File: src/types/puzzle.ts'
);

addCodeBlock(
  'Sample Puzzle Data',
  `{
  "id": "pattern_1",
  "ageRange": "3-4",
  "title": "Color Pattern",
  "question": "🔴 🟢 🔴 🟢 ... ?",
  "options": ["🔴", "🟢", "🔵"],
  "correctAnswer": 0,
  "hint": "It repeats red, green, red, green..."
}`,
  'Example from src/data/patterns.json - Uses emojis for visual appeal'
);

addSection('Age-Based Filtering',
  'The application dynamically filters puzzles based on the selected age range. The filtering algorithm compares ' +
  'the selected age range with each puzzle\'s age range to ensure children only see age-appropriate content.'
);

doc.addPage();

// PAGE 8: Puzzle Game Logic
addPageHeader('🎮 Puzzle Game Engine');

addSection('Game State Management',
  'The puzzle page manages multiple state variables to track the current puzzle, user selections, score, and UI states. ' +
  'This state-driven approach ensures a smooth, interactive gaming experience.'
);

addCodeBlock(
  'State Variables',
  `const [currentIndex, setCurrentIndex] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
const [showResult, setShowResult] = useState(false);
const [score, setScore] = useState(0);
const [showHint, setShowHint] = useState(false);
const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>([]);`,
  'File: src/app/puzzle/[category]/page.tsx - Core game state'
);

addCodeBlock(
  'Answer Handler',
  `const handleAnswer = (index: number) => {
  if (showResult) return;
  setSelectedAnswer(index);
  setShowResult(true);
  if (index === currentPuzzle.correctAnswer) {
    setScore(score + 1);
  }
};`,
  'Validates answer and updates score immediately'
);

addSection('Navigation Logic',
  'The game includes smart navigation with Next and Restart functions. When reaching the last puzzle, ' +
  'users are presented with their final score and options to play again or choose a new category.'
);

addCodeBlock(
  'Next Puzzle Handler',
  `const handleNext = () => {
  if (currentIndex < filteredPuzzles.length - 1) {
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  }
};`,
  'Resets state and advances to next puzzle'
);

doc.addPage();

// PAGE 9: UI Components & Styling
addPageHeader('🎨 UI Components & Styling');

addUIDescription(
  'Puzzle Page Interface',
  'The puzzle page presents an engaging, colorful interface where children can interact with puzzles through large, ' +
  'touch-friendly buttons and receive immediate visual feedback.',
  [
    'Header with Home button, Score display, and Logout button',
    'Category banner with gradient background matching category theme',
    'White card containing the puzzle question and options',
    'Large option buttons (min-height: 120-140px) for easy selection',
    'Visual feedback: Green for correct, Red for incorrect answers',
    'Animated emoji (🎉 or 💪) shown after answer selection',
    'Hint button with toggleable yellow box for assistance',
    'Progress bar at bottom showing completion percentage',
    'Responsive grid layout for options (1 column mobile, 3 columns desktop)'
  ]
);

addSection('Design Philosophy',
  'The entire application follows a consistent design language with rounded corners, soft shadows, gradient backgrounds, ' +
  'and playful emoji icons. The color scheme uses purple, pink, blue, and cyan gradients to create a cheerful, ' +
  'engaging atmosphere suitable for young children.'
);

addCodeBlock(
  'Responsive Option Buttons',
  `className="p-5 sm:p-6 md:p-7 lg:p-8
  rounded-xl sm:rounded-2xl
  text-2xl sm:text-3xl md:text-4xl lg:text-xl
  font-bold transition-all transform
  active:scale-95 sm:hover:scale-105
  min-h-[100px] sm:min-h-[120px]
  md:min-h-[130px] lg:min-h-[140px]"`,
  'Fully responsive with mobile-first approach'
);

doc.addPage();

// PAGE 10: Key Technical Highlights
addPageHeader('⚡ Key Technical Highlights');

addSection('1. Next.js App Router',
  'Utilizes Next.js 16 App Router with dynamic routes for category pages ([category]/page.tsx). ' +
  'The use() hook unwraps params promises for async route parameters.'
);

addSection('2. Client-Side State Management',
  'React Context API provides global auth state without external dependencies. LocalStorage ensures session persistence ' +
  'across browser refreshes.'
);

addSection('3. TypeScript Integration',
  'Full TypeScript implementation with custom interfaces for User, Puzzle, Category, and AgeRange types, ' +
  'providing type safety throughout the application.'
);

addSection('4. Data-Driven Architecture',
  'JSON-based puzzle storage allows easy content updates without code changes. The filtering system dynamically ' +
  'adjusts content based on user selections.'
);

addSection('5. Responsive Design',
  'Tailwind CSS with comprehensive breakpoints (sm, md, lg, xl) ensures perfect rendering on all devices from ' +
  'mobile phones to desktop monitors.'
);

addSection('6. Progressive Enhancement',
  'Graceful degradation with fallback states, loading indicators, and error boundaries. The UI remains functional ' +
  'even if JavaScript features are limited.'
);

addBulletPoint('File Structure:', 0);
addBulletPoint('src/app/ - Next.js pages and layouts', 1);
addBulletPoint('src/components/ - Reusable React components', 1);
addBulletPoint('src/contexts/ - React Context providers', 1);
addBulletPoint('src/data/ - JSON puzzle data files', 1);
addBulletPoint('src/types/ - TypeScript type definitions', 1);

doc.moveDown(1);

addSection('Deployment',
  'The application is deployed on Vercel at puzzle-game-vibe-coding.vercel.app, leveraging Vercel\'s edge network ' +
  'for fast global performance and automatic HTTPS.'
);

doc.fontSize(10)
   .fillColor('#9CA3AF')
   .text('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { align: 'center' })
   .moveDown(0.5)
   .text('End of Documentation', { align: 'center' })
   .moveDown(0.3)
   .text('🎮 SkillSprout - Making Learning Fun!', { align: 'center' });

// Finalize PDF
doc.end();

console.log('✅ PDF generated successfully: SkillSprout_Code_Documentation.pdf');
