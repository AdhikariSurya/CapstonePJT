export type QuizQuestionType =
  | "mcq"
  | "fill_blank"
  | "true_false"
  | "match"
  | "order"
  | "multi_select";

interface QuizQuestionBase {
  id: string;
  type: QuizQuestionType;
  difficulty: number;
  question: string;
  explanation: string;
}

export interface McqQuestion extends QuizQuestionBase {
  type: "mcq" | "true_false";
  options: string[];
  correct: string;
}

export interface FillBlankQuestion extends QuizQuestionBase {
  type: "fill_blank";
  correct: string;
  acceptable_answers?: string[];
}

export interface MatchQuestion extends QuizQuestionBase {
  type: "match";
  pairs: Array<{ left: string; right: string }>;
}

export interface OrderQuestion extends QuizQuestionBase {
  type: "order";
  items: string[];
  correct_order: number[];
}

export interface MultiSelectQuestion extends QuizQuestionBase {
  type: "multi_select";
  options: string[];
  correct: string[];
}

export type QuizQuestion =
  | McqQuestion
  | FillBlankQuestion
  | MatchQuestion
  | OrderQuestion
  | MultiSelectQuestion;

export interface QuizApiResponse {
  quiz_title: string;
  questions: QuizQuestion[];
  metadata: {
    grade: number;
    subject: string;
    topic: string;
    numQuestions: number;
    outputLanguage: string;
    selectedQuestionTypes?: QuizQuestionType[];
    generatedAt: string;
  };
}

export interface StudentAnswer {
  questionId: string;
  difficulty: number;
  questionText: string;
  type: QuizQuestionType;
  studentAnswer: string | string[] | Record<string, string>;
  correctAnswer: string | string[] | Record<string, string>;
  isCorrect: boolean;
  explanation: string;
}
