import type { UploadedContextFile } from "@/lib/contextFiles";

export type TeacherToolFieldType = "text" | "textarea" | "select" | "number";

export interface TeacherToolFieldOption {
  id: string;
  label: string;
}

export interface TeacherToolField {
  id: string;
  label: string;
  type: TeacherToolFieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  defaultValue?: string;
  options?: TeacherToolFieldOption[];
  voiceInput?: boolean;
  min?: number;
  max?: number;
}

export interface TeacherToolConfig {
  fields: TeacherToolField[];
  includeContextFiles?: boolean;
  generateOutput: (values: Record<string, string>, files: UploadedContextFile[]) => string;
}

const COMMON_LANG_OPTIONS: TeacherToolFieldOption[] = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
];

function value(values: Record<string, string>, key: string, fallback = "Not provided"): string {
  const v = values[key]?.trim();
  return v ? v : fallback;
}

function contextNote(files: UploadedContextFile[]): string {
  if (files.length === 0) return "No context files attached.";
  return `Used ${files.length} context file(s): ${files.map((f) => f.name).join(", ")}.`;
}

export const TEACHER_TOOL_CONFIGS: Record<string, TeacherToolConfig> = {
  "writing-feedback": {
    fields: [
      { id: "studentWork", label: "Student Writing Sample", type: "textarea", required: true, rows: 6, voiceInput: true },
      {
        id: "feedbackMode",
        label: "Feedback Focus",
        type: "select",
        required: true,
        defaultValue: "rubric",
        options: [
          { id: "rubric", label: "Rubric-Aligned" },
          { id: "grammar", label: "Grammar & Clarity" },
          { id: "growth", label: "Growth Comments" },
        ],
      },
      { id: "gradeLevel", label: "Grade Level", type: "text", placeholder: "e.g. Grade 7" },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: COMMON_LANG_OPTIONS },
    ],
    generateOutput: (v, files) =>
      `# Writing Feedback\n\n## Summary\nStudent shows progress with clear intent and ideas.\n\n## Strengths\n- Relevant details included\n- Good effort and structure\n\n## Next Steps\n- Strengthen transitions between ideas\n- Add one concrete supporting example\n\n## Teacher Comment\nYou are making good progress. Focus on adding specific evidence and smoother flow.\n\n## Settings\n- Feedback Focus: ${value(v, "feedbackMode")}\n- Grade Level: ${value(v, "gradeLevel")}\n- Output Language: ${value(v, "outputLanguage", "English")}\n- ${contextNote(files)}`,
  },
  "text-rewriter": {
    fields: [
      { id: "originalText", label: "Original Text", type: "textarea", required: true, rows: 6, voiceInput: true },
      {
        id: "rewriteGoal",
        label: "Rewrite Goal",
        type: "select",
        required: true,
        defaultValue: "simplify",
        options: [
          { id: "simplify", label: "Simplify" },
          { id: "formal", label: "More Formal" },
          { id: "concise", label: "More Concise" },
          { id: "engaging", label: "More Engaging" },
        ],
      },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g. Grade 5 students" },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: COMMON_LANG_OPTIONS },
    ],
    generateOutput: (v, files) =>
      `# Rewritten Text\n\n## Rewritten Version\nThis version is rewritten with a "${value(v, "rewriteGoal")}" style and classroom-friendly language.\n\n## Notes\n- Target audience considered: ${value(v, "audience")}\n- Output language: ${value(v, "outputLanguage", "English")}\n- ${contextNote(files)}`,
  },
  "rubric-generator": {
    fields: [
      { id: "assignmentTitle", label: "Assignment Title", type: "text", required: true, placeholder: "e.g. Water Cycle Poster" },
      { id: "gradeLevel", label: "Grade Level", type: "text", required: true, placeholder: "e.g. Grade 6" },
      { id: "criteriaCount", label: "Number of Criteria", type: "number", required: true, defaultValue: "4", min: 2, max: 8 },
      { id: "levels", label: "Performance Levels", type: "number", required: true, defaultValue: "4", min: 2, max: 5 },
      { id: "focusSkills", label: "Focus Skills (Optional)", type: "textarea", rows: 3, voiceInput: true },
    ],
    generateOutput: (v, files) =>
      `# Rubric: ${value(v, "assignmentTitle")}\n\n## Suggested Rubric Structure\n- Grade: ${value(v, "gradeLevel")}\n- Criteria: ${value(v, "criteriaCount")}\n- Levels: ${value(v, "levels")}\n\n| Criteria | Level 4 | Level 3 | Level 2 | Level 1 |\n| --- | --- | --- | --- | --- |\n| Understanding | Deep and accurate | Mostly accurate | Partial | Limited |\n| Evidence | Strong and relevant | Relevant | Some evidence | Minimal |\n| Communication | Clear and organized | Mostly clear | Inconsistent | Unclear |\n\nFocus skills: ${value(v, "focusSkills", "Not specified")}\n\n${contextNote(files)}`,
  },
  "text-proofreader": {
    fields: [
      { id: "text", label: "Text to Proofread", type: "textarea", required: true, rows: 6, voiceInput: true },
      {
        id: "proofStyle",
        label: "Output Style",
        type: "select",
        defaultValue: "minimal",
        options: [
          { id: "minimal", label: "Minimal Corrections" },
          { id: "polished", label: "Polished Rewrite" },
        ],
      },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: COMMON_LANG_OPTIONS },
    ],
    generateOutput: (v, files) =>
      `# Proofreading Result\n\n## Corrections Applied\n- Grammar and tense consistency improved\n- Spelling and punctuation corrected\n- Clarity improved for readability\n\n## Final Version\nProvided in "${value(v, "proofStyle", "minimal")}" style in ${value(v, "outputLanguage", "English")}.\n\n${contextNote(files)}`,
  },
  "informational-texts": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true, placeholder: "e.g. Rainwater Harvesting" },
      {
        id: "gradeBand",
        label: "Grade Band",
        type: "select",
        defaultValue: "middle",
        options: [
          { id: "primary", label: "Primary (1-5)" },
          { id: "middle", label: "Middle (6-8)" },
          { id: "secondary", label: "Secondary (9-12)" },
        ],
      },
      {
        id: "length",
        label: "Length",
        type: "select",
        defaultValue: "medium",
        options: [
          { id: "short", label: "Short" },
          { id: "medium", label: "Medium" },
          { id: "long", label: "Long" },
        ],
      },
      { id: "keyPoints", label: "Key Points to Include", type: "textarea", rows: 3, voiceInput: true },
    ],
    generateOutput: (v, files) =>
      `# Informational Text Draft\n\nTopic: ${value(v, "topic")}\nGrade band: ${value(v, "gradeBand")}\nLength: ${value(v, "length")}\n\n${value(v, "topic")} is an important concept. This draft explains the core idea, simple examples, and real-life relevance in student-friendly language.\n\nKey points requested: ${value(v, "keyPoints", "None specified")}\n\n${contextNote(files)}`,
  },
  "text-translator": {
    fields: [
      { id: "sourceText", label: "Source Text", type: "textarea", required: true, rows: 6, voiceInput: true },
      { id: "sourceLanguage", label: "Source Language (Optional)", type: "text", placeholder: "e.g. English" },
      { id: "targetLanguage", label: "Target Language", type: "select", required: true, defaultValue: "Hindi", options: COMMON_LANG_OPTIONS },
      {
        id: "tone",
        label: "Tone",
        type: "select",
        defaultValue: "neutral",
        options: [
          { id: "neutral", label: "Neutral" },
          { id: "friendly", label: "Friendly" },
          { id: "formal", label: "Formal" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Translation Output\n\n- Source language: ${value(v, "sourceLanguage", "Auto-detected")}\n- Target language: ${value(v, "targetLanguage")}\n- Tone: ${value(v, "tone", "neutral")}\n\nTranslated draft prepared from provided source text.\n\n${contextNote(files)}`,
  },
  "text-leveler": {
    fields: [
      { id: "text", label: "Original Text", type: "textarea", required: true, rows: 6, voiceInput: true },
      { id: "currentLevel", label: "Current Reading Level", type: "text", placeholder: "e.g. Grade 7" },
      { id: "targetLevel", label: "Target Reading Level", type: "text", required: true, placeholder: "e.g. Grade 5" },
      { id: "retainWords", label: "Words to Keep (Optional)", type: "text", placeholder: "e.g. photosynthesis, chlorophyll" },
    ],
    generateOutput: (v, files) =>
      `# Levelled Text\n\nText has been adapted from ${value(v, "currentLevel", "current level")} to ${value(v, "targetLevel")}.\n\n## Changes\n- Simplified sentence structure\n- Reduced complex vocabulary\n- Maintained core meaning\n\nRetained words: ${value(v, "retainWords", "None specified")}\n\n${contextNote(files)}`,
  },
  "text-summarizer": {
    fields: [
      { id: "sourceText", label: "Text to Summarize", type: "textarea", required: true, rows: 6, voiceInput: true },
      {
        id: "summaryFormat",
        label: "Summary Format",
        type: "select",
        required: true,
        defaultValue: "bullet",
        options: [
          { id: "bullet", label: "Bullet Points" },
          { id: "short", label: "Short Paragraph" },
          { id: "detailed", label: "Detailed Summary" },
        ],
      },
      { id: "focus", label: "Focus Area (Optional)", type: "text", placeholder: "e.g. key arguments and evidence" },
    ],
    generateOutput: (v, files) =>
      `# Summary Output\n\nFormat: ${value(v, "summaryFormat")}\nFocus: ${value(v, "focus", "General")}.\n\n## Summary\n- Main idea identified\n- Supporting details condensed\n- Classroom-ready concise output\n\n${contextNote(files)}`,
  },
  "letter-of-recommendation": {
    fields: [
      { id: "studentName", label: "Student Name", type: "text", required: true },
      { id: "institution", label: "Institution / Program", type: "text", required: true },
      { id: "relationship", label: "Your Role / Relationship", type: "text", placeholder: "e.g. Class Teacher for 2 years" },
      { id: "strengths", label: "Key Strengths", type: "textarea", required: true, rows: 4, voiceInput: true },
      { id: "achievements", label: "Achievements (Optional)", type: "textarea", rows: 3, voiceInput: true },
    ],
    generateOutput: (v, files) =>
      `# Letter of Recommendation Draft\n\nTo Whom It May Concern,\n\nI am pleased to recommend ${value(v, "studentName")} for ${value(v, "institution")}.\nAs ${value(v, "relationship", "their teacher")}, I have seen strong qualities in this student.\n\nStrengths: ${value(v, "strengths")}\nAchievements: ${value(v, "achievements", "Not specified")}\n\nSincerely,\nTeacher\n\n${contextNote(files)}`,
  },
  "math-story-word-problems": {
    fields: [
      { id: "mathTopic", label: "Math Topic", type: "text", required: true, placeholder: "e.g. Fractions" },
      {
        id: "difficulty",
        label: "Difficulty",
        type: "select",
        defaultValue: "medium",
        options: [
          { id: "easy", label: "Easy" },
          { id: "medium", label: "Medium" },
          { id: "hard", label: "Hard" },
        ],
      },
      { id: "count", label: "Number of Problems", type: "number", defaultValue: "5", required: true, min: 1, max: 20 },
      { id: "storyTheme", label: "Story Theme", type: "text", placeholder: "e.g. Market day, Cricket, Space" },
    ],
    generateOutput: (v, files) =>
      `# Math Story Word Problems\n\n- Topic: ${value(v, "mathTopic")}\n- Difficulty: ${value(v, "difficulty")}\n- Count: ${value(v, "count")}\n- Theme: ${value(v, "storyTheme", "General classroom context")}\n\nSample Problem:\nA class activity based on ${value(v, "storyTheme", "a daily-life theme")} uses numbers from ${value(v, "mathTopic")}. Students solve the scenario in steps and explain their reasoning.\n\n${contextNote(files)}`,
  },
  "vocabulary-list-generator": {
    fields: [
      { id: "source", label: "Topic / Text", type: "textarea", required: true, rows: 4, voiceInput: true },
      { id: "wordCount", label: "Number of Words", type: "number", defaultValue: "10", required: true, min: 5, max: 30 },
      { id: "gradeBand", label: "Grade Band", type: "text", placeholder: "e.g. Grade 4-5" },
      {
        id: "includeDefinitions",
        label: "Include Definitions",
        type: "select",
        defaultValue: "yes",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Vocabulary List\n\nGenerated ${value(v, "wordCount")} vocabulary terms based on provided source.\n\n- Grade band: ${value(v, "gradeBand", "Not specified")}\n- Include definitions: ${value(v, "includeDefinitions", "yes")}\n\nOutput includes classroom-ready terms with optional meanings.\n\n${contextNote(files)}`,
  },
  "group-work-generator": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "classSize", label: "Class Size", type: "number", required: true, defaultValue: "30", min: 5, max: 100 },
      { id: "groupSize", label: "Preferred Group Size", type: "number", required: true, defaultValue: "4", min: 2, max: 10 },
      { id: "objective", label: "Learning Objective", type: "textarea", rows: 3, voiceInput: true },
      {
        id: "duration",
        label: "Duration",
        type: "select",
        defaultValue: "20m",
        options: [
          { id: "15m", label: "15 mins" },
          { id: "20m", label: "20 mins" },
          { id: "30m", label: "30 mins" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Group Work Plan\n\n- Topic: ${value(v, "topic")}\n- Class size: ${value(v, "classSize")}\n- Group size: ${value(v, "groupSize")}\n- Duration: ${value(v, "duration")}\n\n## Suggested Structure\n1) Form groups\n2) Assign roles\n3) Complete collaborative task\n4) Present outputs\n\nObjective: ${value(v, "objective", "Not specified")}\n\n${contextNote(files)}`,
  },
  "teacher-jokes": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      {
        id: "ageGroup",
        label: "Age Group",
        type: "select",
        defaultValue: "middle",
        options: [
          { id: "primary", label: "Primary" },
          { id: "middle", label: "Middle School" },
          { id: "secondary", label: "Secondary" },
        ],
      },
      { id: "count", label: "Number of Jokes", type: "number", defaultValue: "5", required: true, min: 1, max: 15 },
    ],
    generateOutput: (v, files) =>
      `# Teacher Jokes\n\nTopic: ${value(v, "topic")} | Age group: ${value(v, "ageGroup")} | Count: ${value(v, "count")}\n\n- Why did the notebook smile? Because it had a great lesson today.\n- Why was the math book confident? It solved every problem one step at a time.\n\n${contextNote(files)}`,
  },
  "lesson-hook": {
    fields: [
      { id: "lessonTopic", label: "Lesson Topic", type: "text", required: true },
      { id: "classLevel", label: "Class Level", type: "text", placeholder: "e.g. Grade 8" },
      {
        id: "hookType",
        label: "Hook Type",
        type: "select",
        defaultValue: "question",
        options: [
          { id: "question", label: "Thought-provoking Question" },
          { id: "story", label: "Mini Story" },
          { id: "challenge", label: "Quick Challenge" },
        ],
      },
      { id: "duration", label: "Hook Duration", type: "select", defaultValue: "5", options: [
        { id: "3", label: "3 mins" },
        { id: "5", label: "5 mins" },
        { id: "10", label: "10 mins" },
      ] },
    ],
    generateOutput: (v, files) =>
      `# Lesson Hook\n\nTopic: ${value(v, "lessonTopic")} (${value(v, "classLevel", "class level not specified")})\nType: ${value(v, "hookType")} | Duration: ${value(v, "duration")} mins\n\nHook idea:\nStart with a short prompt that makes students predict, debate, or connect the topic to real life.\n\n${contextNote(files)}`,
  },
  "sentence-starters": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      {
        id: "taskType",
        label: "Task Type",
        type: "select",
        defaultValue: "essay",
        options: [
          { id: "essay", label: "Essay" },
          { id: "discussion", label: "Discussion" },
          { id: "analysis", label: "Analysis" },
          { id: "reflection", label: "Reflection" },
        ],
      },
      { id: "count", label: "Number of Starters", type: "number", defaultValue: "10", required: true, min: 3, max: 25 },
      {
        id: "register",
        label: "Language Register",
        type: "select",
        defaultValue: "academic",
        options: [
          { id: "basic", label: "Basic" },
          { id: "academic", label: "Academic" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Sentence Starters\n\n- Topic: ${value(v, "topic")}\n- Task type: ${value(v, "taskType")}\n- Register: ${value(v, "register")}\n\nExamples:\n- One key idea about this topic is...\n- The evidence suggests that...\n- A contrasting viewpoint is...\n\n${contextNote(files)}`,
  },
  "text-analysis-assignment": {
    fields: [
      { id: "sourceText", label: "Source Text / Passage", type: "textarea", required: true, rows: 6, voiceInput: true },
      { id: "gradeLevel", label: "Grade Level", type: "text", required: true },
      { id: "questionCount", label: "Number of Questions", type: "number", defaultValue: "5", required: true, min: 3, max: 15 },
      {
        id: "responseLength",
        label: "Response Length",
        type: "select",
        defaultValue: "short",
        options: [
          { id: "short", label: "Short Response" },
          { id: "paragraph", label: "Paragraph" },
          { id: "extended", label: "Extended Response" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Text Analysis Assignment\n\nGrade: ${value(v, "gradeLevel")}\nQuestions: ${value(v, "questionCount")}\nResponse type: ${value(v, "responseLength")}\n\n## Prompt\nAnalyze how the author develops the main idea and supports it with evidence.\n\n## Question Set\n1) Identify the main claim.\n2) Cite one strong supporting detail.\n3) Explain the effect of word choice.\n\n${contextNote(files)}`,
  },
  "real-world-connections": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "studentContext", label: "Student Context (Interests / Background)", type: "textarea", rows: 4, voiceInput: true },
      { id: "exampleCount", label: "Number of Examples", type: "number", defaultValue: "5", required: true, min: 2, max: 15 },
      {
        id: "format",
        label: "Output Format",
        type: "select",
        defaultValue: "bullet",
        options: [
          { id: "bullet", label: "Bullet Ideas" },
          { id: "scenario", label: "Mini Scenarios" },
          { id: "discussion", label: "Discussion Prompts" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Real-World Connections\n\nTopic: ${value(v, "topic")}\nFormat: ${value(v, "format")} | Examples: ${value(v, "exampleCount")}\n\nConnections are designed around student context: ${value(v, "studentContext", "Not provided")}.\n\n${contextNote(files)}`,
  },
  "data-table-analysis": {
    fields: [
      { id: "topic", label: "Topic / Theme", type: "text", required: true },
      { id: "rows", label: "Rows", type: "number", required: true, defaultValue: "4", min: 2, max: 10 },
      { id: "columns", label: "Columns", type: "number", required: true, defaultValue: "3", min: 2, max: 8 },
      {
        id: "difficulty",
        label: "Difficulty",
        type: "select",
        defaultValue: "medium",
        options: [
          { id: "easy", label: "Easy" },
          { id: "medium", label: "Medium" },
          { id: "hard", label: "Hard" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Data Table Analysis\n\nTopic: ${value(v, "topic")}\nTable size: ${value(v, "rows")} rows x ${value(v, "columns")} columns\nDifficulty: ${value(v, "difficulty")}\n\nA classroom-ready data table with analysis questions has been drafted.\n\n${contextNote(files)}`,
  },
  "bip-generator": {
    fields: [
      { id: "studentProfile", label: "Student Profile / Needs", type: "textarea", required: true, rows: 4, voiceInput: true },
      { id: "targetBehavior", label: "Target Behavior", type: "text", required: true },
      { id: "triggers", label: "Known Triggers", type: "textarea", rows: 3, voiceInput: true },
      { id: "supports", label: "Preferred Supports", type: "textarea", rows: 3, voiceInput: true },
      {
        id: "monitoring",
        label: "Monitoring Frequency",
        type: "select",
        defaultValue: "daily",
        options: [
          { id: "daily", label: "Daily" },
          { id: "weekly", label: "Weekly" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# BIP Draft\n\n- Student profile: ${value(v, "studentProfile")}\n- Target behavior: ${value(v, "targetBehavior")}\n- Triggers: ${value(v, "triggers", "Not specified")}\n- Supports: ${value(v, "supports", "Not specified")}\n- Monitoring: ${value(v, "monitoring")}\n\nThis draft provides a practical starting plan for intervention and progress tracking.\n\n${contextNote(files)}`,
  },
  "classroom-management": {
    fields: [
      { id: "challenge", label: "Classroom Challenge", type: "textarea", required: true, rows: 4, voiceInput: true },
      { id: "classLevel", label: "Class Level", type: "text", placeholder: "e.g. Grade 7" },
      {
        id: "setting",
        label: "Setting",
        type: "select",
        defaultValue: "whole",
        options: [
          { id: "whole", label: "Whole Class" },
          { id: "small", label: "Small Group" },
          { id: "transition", label: "Transitions" },
        ],
      },
      { id: "strategyCount", label: "Number of Strategies", type: "number", defaultValue: "5", required: true, min: 3, max: 12 },
    ],
    generateOutput: (v, files) =>
      `# Classroom Management Suggestions\n\nChallenge: ${value(v, "challenge")}\nSetting: ${value(v, "setting")} | Class level: ${value(v, "classLevel", "Not specified")}\n\nSuggested strategy set (${value(v, "strategyCount")}):\n1) Set routine expectations\n2) Pre-correct before transitions\n3) Reinforce positive behavior\n4) Apply quick reset protocol\n\n${contextNote(files)}`,
  },
  "conceptual-understanding": {
    fields: [
      { id: "concept", label: "Concept", type: "text", required: true },
      { id: "priorKnowledge", label: "Current Student Understanding", type: "textarea", rows: 3, voiceInput: true },
      { id: "knownMisconceptions", label: "Known Misconceptions (Optional)", type: "textarea", rows: 3, voiceInput: true },
      {
        id: "approach",
        label: "Preferred Approach",
        type: "select",
        defaultValue: "concrete-abstract",
        options: [
          { id: "concrete-abstract", label: "Concrete to Abstract" },
          { id: "discussion", label: "Guided Discussion" },
          { id: "inquiry", label: "Inquiry-Based" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Conceptual Understanding Plan\n\nConcept: ${value(v, "concept")}\nApproach: ${value(v, "approach")}\n\n## Suggested Flow\n- Activate prior knowledge\n- Use targeted examples and counterexamples\n- Check understanding with explanation-based prompts\n\nKnown misconceptions: ${value(v, "knownMisconceptions", "None listed")}\n\n${contextNote(files)}`,
  },
  "common-misconceptions": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "gradeLevel", label: "Grade Level", type: "text", required: true },
      { id: "count", label: "Number of Misconceptions", type: "number", defaultValue: "5", required: true, min: 3, max: 12 },
      {
        id: "includeFixes",
        label: "Include Correction Activities",
        type: "select",
        defaultValue: "yes",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
      },
    ],
    generateOutput: (v, files) =>
      `# Common Misconceptions\n\nTopic: ${value(v, "topic")} | Grade: ${value(v, "gradeLevel")}\nRequested count: ${value(v, "count")}\nInclude correction activities: ${value(v, "includeFixes")}\n\nOutput includes misconception list and targeted correction ideas.\n\n${contextNote(files)}`,
  },
  "professional-message": {
    fields: [
      {
        id: "recipientType",
        label: "Recipient",
        type: "select",
        required: true,
        defaultValue: "parent",
        options: [
          { id: "parent", label: "Parent / Guardian" },
          { id: "colleague", label: "Colleague" },
          { id: "admin", label: "School Admin" },
        ],
      },
      { id: "purpose", label: "Message Purpose", type: "text", required: true, placeholder: "e.g. Progress update" },
      { id: "keyPoints", label: "Key Points", type: "textarea", required: true, rows: 4, voiceInput: true },
      {
        id: "channel",
        label: "Channel",
        type: "select",
        defaultValue: "email",
        options: [
          { id: "email", label: "Email" },
          { id: "whatsapp", label: "WhatsApp" },
        ],
      },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: COMMON_LANG_OPTIONS },
    ],
    generateOutput: (v, files) =>
      `# Professional Message Draft\n\nHello,\n\nI am writing regarding ${value(v, "purpose")}. ${value(v, "keyPoints")}\n\nPlease let me know if you need any additional details.\n\nThank you.\n\n## Settings\n- Recipient: ${value(v, "recipientType")}\n- Channel: ${value(v, "channel")}\n- Language: ${value(v, "outputLanguage", "English")}\n- ${contextNote(files)}`,
  },
  "message-responder": {
    fields: [
      { id: "incomingMessage", label: "Incoming Message", type: "textarea", required: true, rows: 6, voiceInput: true },
      {
        id: "tone",
        label: "Response Tone",
        type: "select",
        defaultValue: "warm",
        options: [
          { id: "warm", label: "Warm" },
          { id: "neutral", label: "Neutral" },
          { id: "firm", label: "Firm" },
        ],
      },
      { id: "goal", label: "Response Goal", type: "text", required: true, placeholder: "e.g. acknowledge concern and share next steps" },
      {
        id: "channel",
        label: "Channel",
        type: "select",
        defaultValue: "email",
        options: [
          { id: "email", label: "Email" },
          { id: "whatsapp", label: "WhatsApp" },
        ],
      },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: COMMON_LANG_OPTIONS },
    ],
    generateOutput: (v, files) =>
      `# Response Draft\n\nThank you for your message. I understand your point and appreciate you reaching out.\n\n${value(v, "goal")}\n\nI will follow up with the next step soon.\n\n## Settings\n- Tone: ${value(v, "tone")}\n- Channel: ${value(v, "channel")}\n- Language: ${value(v, "outputLanguage", "English")}\n- ${contextNote(files)}`,
  },
};

export function getTeacherToolConfig(slug: string): TeacherToolConfig | undefined {
  return TEACHER_TOOL_CONFIGS[slug];
}
