# Dynamic Adaptive Quiz Module

---

## Overview

The Dynamic Quiz Module is an adaptive assessment system that delivers a personalized quiz experience for each student. Inspired by the Item Response Theory (IRT) model used in standardized tests like the SAT, the system adjusts question difficulty in real-time based on student performance. The quiz is interactive, supporting multiple rich question formats beyond basic MCQ, making it engaging and closer to game-like learning.

The key constraint: **one single API call** is made upfront to generate a complete question bank. All adaptive logic, routing, and scoring runs entirely on the frontend using the pre-generated bank.

---

## Teacher Input (Setup Screen)

Before the quiz begins, the teacher configures it:

- **Grade** — Single grade selection (1–10), pill style
- **Subject** — Standard subjects (English, Hindi, Maths, Science, EVS, Social Science, Sanskrit, GK)
- **Topic** — Free text input (e.g. "Photosynthesis", "The Mughal Empire")
- **Output Language** — English / Hindi
- **Content Reference (Optional)** — Textarea for chapter text, notes, or context to base questions on
- **Number of Questions** — How many questions the student will actually answer (default 10, options: 5, 8, 10, 12, 15)

---

## Single API Call Architecture

Since only one API call is allowed (to manage rate limits and latency), the entire question bank is generated upfront in one Gemini 2.5 Flash-Lite call.

### What Gets Generated in One Call

The API generates a **question bank of 25 questions** across 5 difficulty tiers (5 questions per tier), covering all question types. This gives the adaptive algorithm enough material to work with for any quiz length the teacher selects (5–15 questions).

### API Response Structure (JSON)

Gemini is prompted to return a strictly structured JSON object:

```json
{
  "quiz_title": "Photosynthesis - Class 6 Science",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "difficulty": 1,
      "question": "Which gas do plants take in during photosynthesis?",
      "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      "correct": "Carbon Dioxide",
      "explanation": "Plants absorb CO2 from the air and use it along with sunlight and water to make food."
    },
    {
      "id": "q2",
      "type": "fill_blank",
      "difficulty": 1,
      "question": "Plants make their own food using sunlight in a process called ___.",
      "correct": "photosynthesis",
      "acceptable_answers": ["Photosynthesis", "photosynthesis"],
      "explanation": "Photosynthesis is the process by which plants use sunlight, water, and CO2 to produce glucose."
    },
    {
      "id": "q3",
      "type": "true_false",
      "difficulty": 2,
      "question": "Photosynthesis only happens at night when the plant is resting.",
      "correct": "False",
      "explanation": "Photosynthesis requires sunlight and therefore happens during the day, not at night."
    },
    {
      "id": "q4",
      "type": "match",
      "difficulty": 3,
      "question": "Match each part of the plant to its role in photosynthesis.",
      "pairs": [
        { "left": "Leaves", "right": "Where photosynthesis mainly occurs" },
        { "left": "Roots", "right": "Absorb water from soil" },
        { "left": "Chlorophyll", "right": "Captures sunlight" },
        { "left": "Stomata", "right": "Allow CO2 to enter the leaf" }
      ],
      "explanation": "Each part of the plant plays a specific role in enabling photosynthesis."
    },
    {
      "id": "q5",
      "type": "order",
      "difficulty": 4,
      "question": "Arrange the following steps of photosynthesis in the correct sequence.",
      "items": [
        "Glucose is stored or used for energy",
        "Sunlight is absorbed by chlorophyll",
        "CO2 enters through stomata",
        "Water is absorbed by roots",
        "Oxygen is released as a by-product"
      ],
      "correct_order": [3, 1, 2, 0, 4],
      "explanation": "The process starts with absorption of water and CO2, uses sunlight energy via chlorophyll, and produces glucose and oxygen."
    },
    {
      "id": "q6",
      "type": "multi_select",
      "difficulty": 3,
      "question": "Which of the following are raw materials needed for photosynthesis? (Select all that apply)",
      "options": ["Water", "Oxygen", "Carbon Dioxide", "Glucose", "Sunlight"],
      "correct": ["Water", "Carbon Dioxide", "Sunlight"],
      "explanation": "Photosynthesis requires water (from soil), CO2 (from air), and sunlight (energy source). Oxygen and glucose are products, not raw materials."
    }
  ]
}
```

> The full bank has 25 questions spanning all 5 difficulty levels and all question types. The adaptive engine then selects from this bank during the quiz.

---

## Question Types

Six interactive question formats are supported:

### 1. MCQ (Multiple Choice)
Classic 4-option question, one correct answer. Tappable option cards.

### 2. Fill in the Blank
A sentence with a blank. Student types the answer. Accepted answers list handles minor case/spelling variations (checked client-side with normalized comparison).

### 3. True / False
A statement that is either true or false. Two large tappable buttons.

### 4. Match the Following
Two columns: Column A (terms/events) and Column B (definitions/descriptions). Student taps an item in Column A, then taps its match in Column B. Lines are drawn between matched pairs. Shuffle both columns on display.

### 5. Chronological / Logical Ordering
A list of events, steps, or items to be arranged in the correct sequence by dragging. Used for historical timelines, scientific processes, or mathematical steps.

### 6. Multi-Select MCQ
A question with multiple correct answers. Student selects all that apply from a list of options. Checkboxes instead of radio buttons. Evaluated by comparing the set of selected answers to the correct set.

---

## Adaptive Algorithm (Frontend, No API Required)

The adaptive engine runs entirely in the browser using the pre-generated question bank.

### Difficulty Scale
Questions are rated 1–5:
- **1** = Very Easy (basic recall)
- **2** = Easy (simple understanding)
- **3** = Medium (application)
- **4** = Hard (analysis)
- **5** = Very Hard (evaluation/synthesis)

### Starting Point
Quiz always begins at **difficulty 3** (medium).

### Routing Logic After Each Answer

```
If CORRECT:
  → Increment difficulty pointer by +1 (max 5)
  → Select next question from available questions at new difficulty
  → If no unused question at that level, use nearest available level

If WRONG:
  → Decrement difficulty pointer by -1 (min 1)
  → If this is the 2nd consecutive wrong:
      → Drop to difficulty max(current - 2, 1)
      → This "confidence reset" gives 1-2 easy questions before climbing again
  → Select next question from available questions at new difficulty
```

### No Repetition
Each question can only be shown once per quiz session. The engine tracks used question IDs.

### Streak Tracking
- Consecutive correct: shown as a subtle streak counter ("3 in a row! 🔥")
- Consecutive wrong: soft encouragement message shown before next question

### Quiz End Conditions
Quiz ends when the student has answered N questions (the number the teacher selected).

---

## Scoring System

At the end of the quiz, a results summary is shown:

- **Total Score** — Raw correct / total answered
- **Accuracy %** — Correct answers as a percentage
- **Difficulty Reached** — The highest difficulty level the student reached (shows ceiling)
- **Adaptive Score** — A weighted score that rewards answering harder questions correctly:
  - Score = Σ (difficulty_level × 2) for each correct answer
  - Max possible = N × 10 (if all questions answered at level 5)
- **Per-Question Review** — Each question shown with:
  - Student's answer
  - Correct answer (if different)
  - Brief explanation

---

## Frontend UI Flow

### Screen 1: Setup (Teacher)
- Grade / Subject / Topic / Language / Reference text / Number of questions (all pill-style)
- "Start Quiz" button
- On submit → single API call → show loading state → transition to Screen 2

### Screen 2: Quiz (Student)
- Progress bar at top (questions answered / total)
- Current difficulty indicator (subtle, e.g. colored dot or level label)
- Question card (type-specific rendering):
  - MCQ: 4 tappable option cards
  - Fill in blank: Input field with submit
  - True/False: Two large buttons
  - Match: Two-column tap-to-connect interface
  - Order: Draggable list (uses HTML5 drag or touch-based reorder)
  - Multi-select: Checkbox-style option cards + "Confirm" button
- After each answer:
  - Correct: Green flash on correct answer + brief explanation shown
  - Wrong: Red flash + correct answer highlighted + explanation shown
  - "Next Question" button to continue
- Streak indicator if on a run

### Screen 3: Results (Student + Teacher)
- Big score card (adaptive score)
- Accuracy badge
- Highest difficulty reached
- Question-by-question breakdown (expandable)
- "Try Again" and "New Quiz" buttons

---

## Technical Architecture

### API Route
```
POST /api/quiz/generate
```

**Request Body:**
```json
{
  "grade": 6,
  "subject": "Science",
  "topic": "Photosynthesis",
  "outputLanguage": "English",
  "numQuestions": 10,
  "details": "Optional reference content..."
}
```

**Response:**
```json
{
  "quiz_title": "...",
  "questions": [ ...25 question objects... ],
  "metadata": {
    "grade": 6,
    "subject": "Science",
    "topic": "Photosynthesis",
    "numQuestions": 10,
    "generatedAt": "..."
  }
}
```

### Prompt Engineering
The Gemini prompt:
1. Specifies all 6 question types with exact JSON schema for each
2. Requests exactly 25 questions distributed across 5 difficulty levels (5 per level)
3. Distributes question types evenly (roughly 4-5 per type)
4. Instructs Gemini to return **pure JSON only** (no markdown fences, no explanation)
5. Includes cultural context and grade-appropriate vocabulary rules

### Frontend State Machine

```
States: SETUP → LOADING → QUIZ → RESULT
```

The `useQuiz` hook manages:
- `questionBank`: all 25 questions from API
- `usedIds`: Set of question IDs already shown
- `currentDifficulty`: 1–5, starts at 3
- `consecutiveWrong`: counter for confidence reset
- `answers`: array of { questionId, studentAnswer, isCorrect, difficulty }
- `sessionQuestions`: ordered list of questions shown in this quiz (length = numQuestions)

---

## Component Structure

```
/components/quiz/
  QuizSetupForm.tsx         ← Teacher configuration form
  QuizPlayer.tsx            ← Main quiz container / adaptive engine
  QuizResults.tsx           ← Results summary screen
  /question-types/
    MCQQuestion.tsx
    FillBlankQuestion.tsx
    TrueFalseQuestion.tsx
    MatchQuestion.tsx
    OrderQuestion.tsx
    MultiSelectQuestion.tsx
  QuizProgress.tsx          ← Progress bar + streak indicator
  AnswerFeedback.tsx        ← Post-answer correct/wrong animation + explanation
```

---

## Constraints & Notes

- Only 1 Gemini API call per quiz session
- All 25 questions are generated upfront and stored in state
- The frontend never calls the API again during the quiz
- Adaptive logic, scoring, and routing are all pure client-side
- No authentication, database, or save functionality in this phase
- Mobile-first touch interactions (tap, drag) for all question types
- `react-beautiful-dnd` or native HTML5 drag-and-drop for ordering questions

---
