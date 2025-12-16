const PDFDocument = require('pdfkit');
const fs = require('fs');
const https = require('https');
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
     .font('Helvetica-Bold')
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

  // Code background
  const codeLines = code.split('\n');
  const lineHeight = 12;
  const codeHeight = (codeLines.length * lineHeight) + 10;

  doc.rect(doc.x - 5, doc.y - 5, 495, codeHeight)
     .fillAndStroke('#F9FAFB', '#E5E7EB');

  doc.fontSize(9)
     .fillColor('#059669')
     .font('Courier')
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

function addScreenMockup(title, elements) {
  if (doc.y > 550) {
    doc.addPage();
  }

  doc.fontSize(12)
     .fillColor('#7C3AED')
     .font('Helvetica-Bold')
     .text(title, { align: 'center' })
     .moveDown(0.5);

  const startY = doc.y;
  const mockupWidth = 400;
  const mockupHeight = 250;
  const startX = (595 - mockupWidth) / 2; // Center on page

  // Device frame
  doc.roundedRect(startX, startY, mockupWidth, mockupHeight, 10)
     .lineWidth(3)
     .strokeColor('#374151')
     .stroke();

  // Screen background with gradient effect
  doc.roundedRect(startX + 5, startY + 5, mockupWidth - 10, mockupHeight - 10, 8)
     .fillColor('#FEF3C7')
     .fill();

  // Add UI elements
  let currentY = startY + 20;
  elements.forEach(element => {
    if (element.type === 'header') {
      doc.fontSize(16)
         .fillColor('#8B5CF6')
         .font('Helvetica-Bold')
         .text(element.text, startX + 20, currentY, { width: mockupWidth - 40, align: 'center' });
      currentY += 30;
    } else if (element.type === 'subheader') {
      doc.fontSize(12)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(element.text, startX + 20, currentY, { width: mockupWidth - 40, align: 'center' });
      currentY += 25;
    } else if (element.type === 'input') {
      doc.roundedRect(startX + 30, currentY, mockupWidth - 60, 35, 8)
         .fillAndStroke('#FFFFFF', '#D1D5DB');
      doc.fontSize(10)
         .fillColor('#9CA3AF')
         .font('Helvetica')
         .text(element.placeholder, startX + 40, currentY + 12);
      currentY += 45;
    } else if (element.type === 'button') {
      doc.roundedRect(startX + 30, currentY, mockupWidth - 60, 40, 10)
         .fillColor(element.color || '#8B5CF6')
         .fill();
      doc.fontSize(12)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text(element.text, startX + 30, currentY + 13, { width: mockupWidth - 60, align: 'center' });
      currentY += 50;
    } else if (element.type === 'card') {
      const cardWidth = (mockupWidth - 80) / 3;
      const spacing = 10;

      for (let i = 0; i < 3; i++) {
        const cardX = startX + 30 + (i * (cardWidth + spacing));
        doc.roundedRect(cardX, currentY, cardWidth, 60, 8)
           .fillColor('#FFFFFF')
           .fill();
        doc.strokeColor('#E5E7EB')
           .roundedRect(cardX, currentY, cardWidth, 60, 8)
           .stroke();

        // Card content
        doc.fontSize(20)
           .fillColor('#8B5CF6')
           .text(element.icons[i], cardX, currentY + 15, { width: cardWidth, align: 'center' });
        doc.fontSize(7)
           .fillColor('#374151')
           .font('Helvetica-Bold')
           .text(element.labels[i], cardX, currentY + 40, { width: cardWidth, align: 'center' });
      }
      currentY += 70;
    }
  });

  doc.y = startY + mockupHeight + 20;
  doc.moveDown(0.5);
}

// PAGE 1: Cover Page
doc.fontSize(48)
   .fillColor('#8B5CF6')
   .font('Helvetica-Bold')
   .text('SkillSprout', { align: 'center' })
   .moveDown(0.3);

doc.fontSize(14)
   .fillColor('#EC4899')
   .text('[Educational Puzzle Game]', { align: 'center' })
   .moveDown(0.5);

doc.fontSize(28)
   .fillColor('#6B7280')
   .text('Code Documentation', { align: 'center' })
   .moveDown(2);

doc.fontSize(16)
   .fillColor('#6B7280')
   .font('Helvetica')
   .text('Interactive Learning Platform for Kids Ages 3-6', { align: 'center' })
   .moveDown(3);

doc.rect(100, doc.y, 395, 200)
   .fillAndStroke('#F3E8FF', '#C084FC');

doc.fillColor('#6B7280')
   .fontSize(14)
   .font('Helvetica-Bold')
   .text('Technology Stack', 100, doc.y + 20, { width: 395, align: 'center' })
   .moveDown(1);

doc.font('Helvetica')
   .fontSize(12)
   .text('Next.js 16 (App Router)', { align: 'center' })
   .moveDown(0.3)
   .text('React 19 with Hooks', { align: 'center' })
   .moveDown(0.3)
   .text('TypeScript 5', { align: 'center' })
   .moveDown(0.3)
   .text('Tailwind CSS 4', { align: 'center' })
   .moveDown(0.3)
   .text('Context API for State Management', { align: 'center' })
   .moveDown(2);

doc.fontSize(11)
   .fillColor('#9CA3AF')
   .text('Live at: puzzle-game-vibe-coding.vercel.app', { align: 'center' })
   .moveDown(0.5)
   .text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, { align: 'center' });

doc.addPage();

// PAGE 2: Project Overview with Login Screen Mockup
addPageHeader('Project Overview');

addSection('About SkillSprout',
  'SkillSprout is an interactive educational puzzle game designed for young children aged 3-6 years. ' +
  'The application provides a fun and engaging way for kids to develop cognitive skills through pattern recognition, ' +
  'shape matching, and logical thinking exercises. Built with modern web technologies, it offers a responsive, ' +
  'child-friendly interface with role-based authentication for administrators, teachers, and parents.'
);

addSection('Key Features',
  'Three main puzzle categories (Patterns, Shape Match, Logical Thinking) with age-appropriate content. ' +
  'Includes real-time scoring, helpful hints, progress tracking, and a beautiful gradient-based UI.'
);

addScreenMockup('Login Page Screenshot', [
  { type: 'header', text: 'SkillSprout' },
  { type: 'subheader', text: 'Welcome Back!' },
  { type: 'input', placeholder: 'Enter your username' },
  { type: 'input', placeholder: 'Enter your password' },
  { type: 'button', text: 'Login', color: '#8B5CF6' }
]);

doc.addPage();

// PAGE 3: Authentication System
addPageHeader('Authentication System');

addSection('Overview',
  'The authentication system is built using React Context API, providing centralized state management for user ' +
  'authentication. It supports three user roles: Administrator, Teacher, and Parent, with demo credentials.'
);

addCodeBlock(
  'User Interface & Credentials (src/contexts/AuthContext.tsx)',
  `interface User {
  username: string;
  role: string;
}

const validUsers = [
  { username: 'admin', password: 'admin123',
    role: 'Administrator' },
  { username: 'teacher', password: 'teacher123',
    role: 'Teacher' },
  { username: 'parent', password: 'parent123',
    role: 'Parent' }
];`,
  'Demo credentials for testing different user roles'
);

addCodeBlock(
  'Login Function with LocalStorage Persistence',
  `const login = (username: string, password: string): boolean => {
  const foundUser = validUsers.find(
    (u) => u.username === username &&
           u.password === password
  );

  if (foundUser) {
    const userData = {
      username: foundUser.username,
      role: foundUser.role
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  }
  return false;
};`,
  'Authentication with browser session persistence'
);

doc.addPage();

// PAGE 4: Protected Routes & Home Page
addPageHeader('Protected Routes & Home Dashboard');

addSection('Route Protection',
  'The ProtectedRoute component wraps pages requiring authentication, automatically redirecting ' +
  'unauthenticated users to the login page.'
);

addCodeBlock(
  'ProtectedRoute Component (src/components/ProtectedRoute.tsx)',
  `export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}`,
  'Automatic redirect for unauthorized access'
);

addScreenMockup('Home Page Dashboard Screenshot', [
  { type: 'header', text: 'SkillSprout' },
  { type: 'subheader', text: 'Choose Your Puzzle Category' },
  { type: 'card',
    icons: ['[P]', '[S]', '[L]'],
    labels: ['Patterns', 'Shapes', 'Logical']
  }
]);

doc.addPage();

// PAGE 5: Category Selection & Age Filtering
addPageHeader('Category Selection & Age Filtering');

addSection('Age-Based Content Filtering',
  'Users select their age range (3-4, 4-5, or 5-6 years), and puzzles are dynamically filtered to show ' +
  'only age-appropriate content.'
);

addCodeBlock(
  'Category Configuration (src/app/page.tsx)',
  `const categories = [
  {
    id: 'patterns',
    name: 'Patterns',
    emoji: '[Pattern Icon]',
    description: 'Complete the pattern!',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'shapes_match',
    name: 'Shape Match',
    emoji: '[Star Icon]',
    description: 'Find the right shape!',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'logical',
    name: 'Logical Thinking',
    emoji: '[Brain Icon]',
    description: 'Use your brain!',
    color: 'from-green-400 to-emerald-400'
  }
];`,
  'Three distinct puzzle categories with unique styling'
);

addCodeBlock(
  'Age Filter Logic',
  `useEffect(() => {
  const puzzles = categoryData[category] || [];
  const filtered = ageParam
    ? puzzles.filter((p) => {
        const puzzleAges = p.ageRange.split('-').map(Number);
        const selectedAges = ageParam.split('-').map(Number);
        return (
          puzzleAges[0] <= selectedAges[1] &&
          puzzleAges[1] >= selectedAges[0]
        );
      })
    : puzzles;
  setFilteredPuzzles(filtered);
}, [category, ageParam]);`,
  'Dynamic filtering based on age range overlap'
);

doc.addPage();

// PAGE 6: Puzzle Data Structure
addPageHeader('Puzzle Data Structure');

addSection('Type-Safe Data Architecture',
  'Puzzles are stored in JSON files with TypeScript interfaces ensuring type safety throughout the application.'
);

addCodeBlock(
  'Puzzle Interface (src/types/puzzle.ts)',
  `export type AgeRange = "3-4" | "4-5" | "5-6" |
                         "3-5" | "4-6";

export interface Puzzle {
  id: string;
  ageRange: AgeRange;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
}`,
  'Strong typing for puzzle data validation'
);

addCodeBlock(
  'Sample Puzzle Data (src/data/patterns.json)',
  `{
  "id": "pattern_1",
  "ageRange": "3-4",
  "title": "Color Pattern",
  "question": "[Red] [Green] [Red] [Green] ... ?",
  "options": ["[Red]", "[Green]", "[Blue]"],
  "correctAnswer": 0,
  "hint": "It repeats red, green, red, green..."
}`,
  'Uses emoji icons for visual appeal to children'
);

addSection('Data Organization',
  'Three JSON files organize puzzles by category: patterns.json (15 puzzles), shapes_match.json, and logical.json. ' +
  'Each file contains an array of puzzle objects loaded dynamically based on the selected category.'
);

doc.addPage();

// PAGE 7: Puzzle Game Logic
addPageHeader('Puzzle Game Engine');

addSection('State Management',
  'The puzzle page uses React hooks to manage game state including current puzzle index, selected answers, ' +
  'score tracking, and UI state for hints and results.'
);

addCodeBlock(
  'Game State (src/app/puzzle/[category]/page.tsx)',
  `const [currentIndex, setCurrentIndex] = useState(0);
const [selectedAnswer, setSelectedAnswer] =
  useState<number | null>(null);
const [showResult, setShowResult] = useState(false);
const [score, setScore] = useState(0);
const [showHint, setShowHint] = useState(false);
const [filteredPuzzles, setFilteredPuzzles] =
  useState<Puzzle[]>([]);`,
  'Comprehensive state tracking for gameplay'
);

addCodeBlock(
  'Answer Validation',
  `const handleAnswer = (index: number) => {
  if (showResult) return;

  setSelectedAnswer(index);
  setShowResult(true);

  if (index === currentPuzzle.correctAnswer) {
    setScore(score + 1);
  }
};`,
  'Immediate feedback and score updates'
);

addCodeBlock(
  'Navigation Control',
  `const handleNext = () => {
  if (currentIndex < filteredPuzzles.length - 1) {
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  }
};`,
  'Progress through puzzles with state reset'
);

addScreenMockup('Puzzle Game Interface Screenshot', [
  { type: 'header', text: 'Pattern Recognition' },
  { type: 'subheader', text: '[Circle] [Square] [Circle] ... ?' },
  { type: 'card',
    icons: ['[O]', '[□]', '[△]'],
    labels: ['Option 1', 'Option 2', 'Option 3']
  },
  { type: 'button', text: 'Show Hint', color: '#F59E0B' }
]);

doc.addPage();

// PAGE 8: UI/UX Design Patterns
addPageHeader('UI/UX Design Patterns');

addSection('Design Philosophy',
  'The interface uses a playful, colorful design with gradient backgrounds, rounded corners, and large touch-friendly ' +
  'buttons optimized for young children. Consistent purple, pink, and cyan color schemes create visual coherence.'
);

addCodeBlock(
  'Responsive Button Styling',
  `className="p-5 sm:p-6 md:p-7 lg:p-8
  rounded-xl sm:rounded-2xl
  text-2xl sm:text-3xl md:text-4xl
  font-bold transition-all transform
  active:scale-95 sm:hover:scale-105
  min-h-[100px] sm:min-h-[120px]
  bg-gradient-to-br from-blue-100
  to-purple-100"`,
  'Mobile-first responsive design with Tailwind CSS'
);

addSection('Visual Feedback System',
  'The game provides immediate visual feedback: green backgrounds for correct answers, red for incorrect ones, ' +
  'animated emoji celebrations, and smooth transitions between states.'
);

addCodeBlock(
  'Dynamic Styling Based on Game State',
  `className={
  showResult
    ? index === currentPuzzle.correctAnswer
      ? 'bg-green-400 text-white shadow-lg
         scale-105'
      : index === selectedAnswer
        ? 'bg-red-400 text-white'
        : 'bg-gray-200 text-gray-600'
    : 'bg-gradient-to-br from-blue-100
       to-purple-100 cursor-pointer'
}`,
  'Conditional styling for interactive feedback'
);

addSection('Progress Tracking',
  'A visual progress bar at the bottom shows completion percentage, while the score is prominently displayed ' +
  'in the header. Users can see their progress at a glance.'
);

addCodeBlock(
  'Progress Bar Implementation',
  `<div className="bg-gray-200 rounded-full h-4
     overflow-hidden">
  <div
    className="bg-gradient-to-r from-purple-500
               to-pink-500 h-full transition-all"
    style={{
      width: \`\${((currentIndex + 1) /
             filteredPuzzles.length) * 100}%\`
    }}
  />
</div>`,
  'Dynamic width based on puzzle progress'
);

doc.addPage();

// PAGE 9: Technical Architecture
addPageHeader('Technical Architecture');

addSection('Next.js App Router',
  'The application uses Next.js 16 with the App Router for file-based routing. Dynamic routes handle category ' +
  'pages with URL parameters for age filtering.'
);

addCodeBlock(
  'Dynamic Route Structure',
  `/app
  /login
    page.tsx          # Login page
  page.tsx            # Home dashboard
  /puzzle
    /[category]
      page.tsx        # Dynamic puzzle page`,
  'File: Project structure showing routing'
);

addSection('Client-Side Rendering',
  'Pages use "use client" directive for interactive features requiring React hooks and browser APIs. ' +
  'The AuthContext provider wraps the entire app in the root layout.'
);

addCodeBlock(
  'Root Layout with AuthProvider (src/app/layout.tsx)',
  `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}`,
  'Global authentication context'
);

addSection('File Organization',
  'Clear separation of concerns with dedicated folders for components, contexts, types, and data.'
);

addBulletPoint('src/app/ - Next.js pages and layouts (routing)', 0);
addBulletPoint('src/components/ - Reusable React components', 0);
addBulletPoint('src/contexts/ - React Context providers for state', 0);
addBulletPoint('src/data/ - JSON puzzle data files', 0);
addBulletPoint('src/types/ - TypeScript type definitions', 0);

doc.addPage();

// PAGE 10: Key Features & Deployment
addPageHeader('Key Features & Deployment');

addSection('Core Features Summary',
  'SkillSprout combines educational value with engaging gameplay through carefully designed features.'
);

addBulletPoint('Role-based authentication (Admin, Teacher, Parent)', 0);
addBulletPoint('Three puzzle categories with 45+ puzzles total', 0);
addBulletPoint('Age-appropriate filtering (3-4, 4-5, 5-6 years)', 0);
addBulletPoint('Real-time score tracking and progress visualization', 0);
addBulletPoint('Optional hints for each puzzle', 0);
addBulletPoint('Responsive design for all devices', 0);
addBulletPoint('Colorful, child-friendly interface', 0);
addBulletPoint('LocalStorage session persistence', 0);

doc.moveDown(1);

addSection('Technical Highlights',
  'Modern web development practices ensure maintainability, performance, and scalability.'
);

addBulletPoint('TypeScript for type safety and better developer experience', 0);
addBulletPoint('React 19 with modern hooks (useState, useEffect, useContext)', 0);
addBulletPoint('Tailwind CSS 4 for utility-first styling', 0);
addBulletPoint('JSON-based data storage for easy content updates', 0);
addBulletPoint('Protected routes with automatic authentication checks', 0);
addBulletPoint('Responsive design with mobile-first approach', 0);

doc.moveDown(1);

addSection('Deployment & Performance',
  'The application is deployed on Vercel, providing global CDN distribution, automatic HTTPS, and serverless functions. ' +
  'The static-first approach with client-side interactivity ensures fast load times and smooth user experience.'
);

addCodeBlock(
  'Deployment Configuration',
  `Live URL:
  puzzle-game-vibe-coding.vercel.app

Platform: Vercel
Framework: Next.js 16
Build Command: npm run build
Output Directory: .next

Features:
- Automatic HTTPS
- Global CDN
- Instant cache invalidation
- Zero-downtime deployments`,
  'Production deployment details'
);

addSection('Future Enhancement Opportunities',
  'Potential improvements include adding more puzzle categories, implementing a backend database for user progress tracking, ' +
  'adding multiplayer features, integrating parental dashboard for progress monitoring, and expanding age ranges.'
);

doc.fontSize(10)
   .fillColor('#9CA3AF')
   .text('\n\n' + '='.repeat(80), { align: 'center' })
   .moveDown(0.5)
   .fontSize(12)
   .fillColor('#8B5CF6')
   .font('Helvetica-Bold')
   .text('End of Documentation', { align: 'center' })
   .moveDown(0.3)
   .fontSize(10)
   .fillColor('#9CA3AF')
   .font('Helvetica')
   .text('SkillSprout - Making Learning Fun for Kids Ages 3-6', { align: 'center' })
   .moveDown(0.3)
   .text('GitHub: github.com/VaishaliGovindaraj/PuzzleGame_VibeCoding', { align: 'center' });

// Finalize PDF
doc.end();

console.log('✅ PDF generated successfully: SkillSprout_Code_Documentation.pdf');
console.log('📄 10 pages with code highlights and UI mockups');
