export interface TeacherToolDefinition {
  slug: string;
  name: string;
  description: string;
}

export const TEACHER_TOOLS: TeacherToolDefinition[] = [
  {
    slug: "writing-feedback",
    name: "Writing Feedback",
    description: "Generate feedback on student writing based on custom criteria or a rubric.",
  },
  {
    slug: "text-rewriter",
    name: "Text Rewriter",
    description: "Take any text and rewrite it with custom criteria.",
  },
  {
    slug: "rubric-generator",
    name: "Rubric Generator",
    description: "Generate a custom rubric for any assignment.",
  },
  {
    slug: "text-proofreader",
    name: "Text Proofreader",
    description: "Proofread text for grammar, spelling, punctuation, and clarity.",
  },
  {
    slug: "informational-texts",
    name: "Informational Texts",
    description: "Generate informational texts for class based on a chosen topic.",
  },
  {
    slug: "text-translator",
    name: "Text Translator",
    description: "Translate text into a selected language.",
  },
  {
    slug: "text-leveler",
    name: "Text Leveler",
    description: "Adapt a text to a specific student reading level.",
  },
  {
    slug: "text-summarizer",
    name: "Text Summarizer",
    description: "Summarize text to the length and depth you need.",
  },
  {
    slug: "letter-of-recommendation",
    name: "Letter of Recommendation",
    description: "Generate a recommendation letter draft for a student.",
  },
  {
    slug: "math-story-word-problems",
    name: "Math Story Word Problems",
    description: "Create topic-based math word problems with a story context.",
  },
  {
    slug: "vocabulary-list-generator",
    name: "Vocabulary List Generator",
    description: "Generate vocabulary words from a topic, subject, or text.",
  },
  {
    slug: "group-work-generator",
    name: "Group Work Generator",
    description: "Generate group activities with group size and task ideas.",
  },
  {
    slug: "teacher-jokes",
    name: "Teacher Jokes",
    description: "Generate student-friendly jokes based on a topic.",
  },
  {
    slug: "lesson-hook",
    name: "Lesson Hook",
    description: "Suggest engaging lesson hooks for your class.",
  },
  {
    slug: "sentence-starters",
    name: "Sentence Starters",
    description: "Generate sentence starters for assignments and discussions.",
  },
  {
    slug: "text-analysis-assignment",
    name: "Text Analysis Assignment",
    description: "Generate a text assignment with prompt and questions.",
  },
  {
    slug: "real-world-connections",
    name: "Real World Connections",
    description: "Generate real-world examples connected to classroom topics.",
  },
  {
    slug: "data-table-analysis",
    name: "Data Table Analysis",
    description: "Create simple data tables with analysis questions.",
  },
  {
    slug: "bip-generator",
    name: "BIP Generator",
    description: "Draft behavior intervention plan ideas for student support.",
  },
  {
    slug: "classroom-management",
    name: "Classroom Management",
    description: "Generate strategies for classroom management challenges.",
  },
  {
    slug: "conceptual-understanding",
    name: "Conceptual Understanding",
    description: "Suggest methods to deepen conceptual understanding.",
  },
  {
    slug: "common-misconceptions",
    name: "Common Misconceptions",
    description: "Identify misconceptions and suggest correction strategies.",
  },
  {
    slug: "professional-message",
    name: "Professional Message",
    description: "Generate a professional email or WhatsApp message.",
  },
  {
    slug: "message-responder",
    name: "Message Responder",
    description: "Generate a response to a received email or WhatsApp message.",
  },
];

export function getTeacherToolBySlug(slug: string): TeacherToolDefinition | undefined {
  return TEACHER_TOOLS.find((tool) => tool.slug === slug);
}
