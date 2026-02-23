# Prompt — Audio Module (Phase 1 Functional)

We are now implementing the **Audio Module** 
This module evaluates student oral reading using **Gemini 2.5 Flash Lite**.

We already have the Gemini API key stored securely in environment variables.

---

## 🧠 Model to Use

Use:

```
gemini-2.5-flash-lite
```

Use official Google Gemini SDK for Node.js.

---

## 🎯 Goal of This Phase

Build a working MVP of the Audio Module that:

1. Displays reading passages
2. Records student audio
3. Sends audio + reference text to Gemini
4. Returns structured evaluation
5. Displays evaluation clearly

---

#  UI Requirements (Mobile First)

## Language Selection

pill selection with languages:

- English
- Hindi
- Bengali

---

## Reading Passage Display

Show 2 example sentences per language.

### English

1. The sun rises in the east and sets in the west.
2. Rani went to the market to buy fresh vegetables.

### Hindi

1. सूरज पूर्व दिशा में उगता है और पश्चिम में अस्त होता है।
2. रीमा हर दिन स्कूल समय पर जाती है।

### Bengali

1. সূর্য পূর্ব দিকে উদয় হয় এবং পশ্চিমে অস্ত যায়।
2. রাহুল প্রতিদিন সময়মতো বিদ্যালয়ে যায়।

When a language is selected:

- Show its 2 sentences clearly
- Large readable font
- Good line spacing
- Clean layout

---

## Audio Recording

Add:

- Start Recording button
- Stop Recording button

Record audio in a format Gemini supports (e.g., webm or wav).
Convert to base64 before sending.

---

## Optional Evaluation Criteria

Add optional textarea:

Label:
"Custom Evaluation Focus (Optional)"

Teacher can type something like:

- Focus more on pronunciation
- Ignore minor pauses
- Check confidence level
- Strict grading

This field is optional.

---

# 🧠 Gemini Evaluation Logic

When student clicks “Evaluate Reading”:

Send to Gemini:

- The reference text
- The audio file (base64)
- The optional teacher criteria

---

## Gemini Prompt Structure (Important)

Construct a structured evaluation prompt like this:

SYSTEM INSTRUCTION:

You are an expert reading assessment assistant for rural school students in India.
Evaluate the student’s oral reading performance.

Evaluate on:

1. Word Accuracy (Did they say all words correctly?)
2. Pronunciation Quality
3. Fluency
4. Pacing
5. Confidence
6. Overall Reading Level

If teacher has provided extra criteria, incorporate it.

Be constructive and supportive.

Return output STRICTLY in JSON format:

{
"word_accuracy_score": number (0-10),
"pronunciation_score": number (0-10),
"fluency_score": number (0-10),
"pacing_score": number (0-10),
"confidence_score": number (0-10),
"overall_score": number (0-10),
"mistakes": [
"list specific word mistakes if any"
],
"strengths": "short paragraph",
"improvements": "short paragraph",
"teacher_summary": "2-3 line summary for teacher"
}

Do NOT return anything outside JSON.

---

# Backend

Create:

```
/app/api/evaluate-audio/route.ts
```

POST endpoint:

Accept:

- referenceText
- audioBase64
- optionalCriteria

Call Gemini 2.5 Flash Lite.

Return parsed JSON to frontend.

Handle:

- JSON parsing errors
- API failures
- Timeout fallback

---

# Frontend Results UI

After evaluation:

Display:

- Overall Score (big highlight)
- Each sub-score (0–10)
- Strengths
- Improvements
- Teacher Summary
- Mistakes list (if exists)

Design:

- Clean cards
- Color-coded scores (soft, not flashy)
- Mobile-friendly layout

---

#  Performance Constraints

- Keep bundle size small
- Avoid unnecessary libraries
- Do not use heavy UI libraries
- Keep everything responsive
- Handle loading state
- Show error state clearly

---

# Edge Cases

- No audio recorded → show error
- Gemini returns invalid JSON → retry once
- Network failure → friendly message

---

# Do NOT Add

- Authentication
- Database
- Save history
- Admin dashboard
- Student login
- Analytics

We will add those later.

---

# After Completion

Ensure:

- Works on mobile viewport
- Recording works
- Gemini call works
- JSON properly parsed
- No TypeScript errors
- Clean and readable code

