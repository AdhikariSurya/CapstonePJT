export interface StudentToolDefinition {
  slug: string;
  name: string;
  description: string;
}

export const STUDENT_TOOLS: StudentToolDefinition[] = [
  { slug: "research-assistant", name: "Research Assistant", description: "Find information and sources for a research project." },
  { slug: "text-translator", name: "Text Translator", description: "Translate any text or uploaded document into any language." },
  { slug: "character-chatbot", name: "Character Chatbot", description: "Chat with any historic figure, author, or recognizable character from a story." },
  { slug: "create-a-skit", name: "Create a Skit!", description: "Create a skit for class or for fun." },
  { slug: "step-by-step", name: "Step by Step", description: "Get step-by-step directions on any topic or task." },
  { slug: "college-career-counselor", name: "College & Career Counselor", description: "Ask any questions about college or careers." },
  { slug: "idea-generator", name: "Idea Generator", description: "Use AI as a thought partner to generate ideas on any topic." },
  { slug: "five-questions", name: "5 Questions", description: "Use AI to ask you 5 questions to push your thinking on any topic or idea." },
  { slug: "book-suggestions", name: "Book Suggestions", description: "Discover books that match your interests." },
  { slug: "text-rewriter", name: "Text Rewriter", description: "Take any text and rewrite it with custom criteria." },
  { slug: "text-summarizer", name: "Text Summarizer", description: "Summarize any text in whatever length you choose." },
  { slug: "expand-on-my-idea", name: "Expand on My Idea", description: "Use AI as a thought partner to expand on your creativity." },
  { slug: "literary-devices", name: "Literary Devices", description: "Generate examples of literary devices based on any topic to enhance writing." },
  { slug: "informational-texts", name: "Informational Texts", description: "Generate custom informational texts on any topic." },
  { slug: "sentence-starters", name: "Sentence Starters", description: "Get ideas to help you get started with writing on any topic." },
  { slug: "role-play", name: "Role Play", description: "Assign this chatbot a custom role to help you practice." },
  { slug: "data-collection-table", name: "Data Collection Table", description: "Generate a table to use to collect data." },
  { slug: "conceptual-understanding", name: "Conceptual Understanding", description: "Generate ideas about how to grow conceptual understanding of topics you're learning." },
  { slug: "tongue-twisters", name: "Tongue Twisters", description: "Generate challenging tongue twisters to say out loud." },
  { slug: "thank-you-note", name: "Thank You Note", description: "Generate a draft thank you note to show your appreciation." },
  { slug: "multiple-explanations", name: "Multiple Explanations", description: "Generate more explanations of topics and concepts to understand them better." },
  { slug: "study-habits", name: "Study Habits", description: "Get a plan and study tips to prepare for any test, assignment, or project." },
  { slug: "make-it-relevant", name: "Make it Relevant!", description: "Connect what you're learning to your interests and the world." },
  { slug: "message-writer", name: "Message Writer", description: "Generate a draft professional message to teachers, peers, or others." },
  { slug: "real-world-connections", name: "Real World Connections", description: "Generate real world examples for what you're learning about." },
];

export function getStudentToolBySlug(slug: string): StudentToolDefinition | undefined {
  return STUDENT_TOOLS.find((tool) => tool.slug === slug);
}
