## Test Setup (once)

- Run app locally with your env vars loaded.
- Use **Teacher profile** for creation/testing.
- Keep Supabase table editor open for:
  - `graded_quizzes`
  - `graded_submissions`

---

## 1) Mode Split / Routing

### T1: Games page mode selector (teacher)

- **PASSED**

### T2: Practice quiz unchanged

- **PASSED**

### T3: Student side unchanged

- **PASSED**

---

## 2) Graded Quiz Creation

### T4: Required validation

- **PASSED**

### T5: Successful graded creation

- **PASSED**

### T6: Share code uniqueness sanity

- **PASSED**

---

## 3) Student Join + Attempt Guard

### T7: Join with valid code

- **PASSED**

### T8: Duplicate roll blocked

- **Steps:** Submit once with roll `101` → retry same quiz with same roll.
- **Expected:** “Already attempted/can’t do” style block.

### T9: Different roll allowed

- **Steps:** Join same quiz with roll `102`.
- **Expected:** Allowed to start.

### T10: Invalid/nonexistent code

- **Steps:** Open `/games/join/INVALID1`.
- **Expected:** Quiz not found / cannot join.

---

## 4) Timer / Availability Logic

### T11: Timer auto-submit

- **Steps:** Create 1-minute quiz, attempt partially, wait till time hits zero.
- **Expected:** Auto-submit triggers; result shown based on attempted answers.

### T12: Availability end cutoff

- **Steps:** Set `available until` to near-future, wait till passed, then try joining.
- **Expected:** New attempts blocked (“no longer accepting responses”).

### T13: Short global window vs duration

- **Steps:** duration 10 min, availability closes in 2 min; start attempt.
- **Expected:** Effective time should stop when availability closes.

---

## 5) Reveal Mode Behavior

### T14: Reveal after each question

- **Steps:** Teacher sets `per_question`, student answers.
- **Expected:** Correct/incorrect + explanation shown immediately each question.

### T15: Reveal at end

- **Steps:** Teacher sets `end`, student answers.
- **Expected:** No per-question correctness shown during attempt; review appears at end.

---

## 6) Score Visibility Toggle

### T16: Show final score = ON

- **Steps:** Student completes quiz.
- **Expected:** Score summary visible on result page.

### T17: Show final score = OFF

- **Steps:** Create another quiz with toggle OFF → student completes.
- **Expected:** Score summary hidden; completion message still shown.

---

## 7) Teacher Results / DB Integrity

### T18: Submission list in teacher view

- **Steps:** After student submissions, teacher clicks refresh in submissions table.
- **Expected:** Rows show Name, Roll, Score, Submitted time.

### T19: DB rows for submissions

- **Steps:** Check `graded_submissions` in Supabase.
- **Expected:** One row per unique `(quiz_id, roll_normalized)` with score + answers JSON.

### T20: Duplicate DB protection

- **Steps:** Force repeat submit (same quiz+roll) from UI flow.
- **Expected:** No duplicate row; request blocked/handled gracefully.

---

## 8) Regression / Stability

### T21: Existing APIs still work

- **Steps:** Run normal practice generation and play.
- **Expected:** No break in `/api/quiz/generate` flow.

### T22: Page reload resilience

- **Steps:** During join and during graded teacher page, refresh browser.
- **Expected:** No crash; routes load safely (state reset is acceptable).

---

## Suggested Result Template (send me later)

Use this format when you report back:

- `T1 Pass/Fail - notes`
- `T2 Pass/Fail - notes`
- ...
- `T22 Pass/Fail - notes`

If any fail, include:

- exact step
- screenshot/error text
- whether issue is teacher side or student side

Then I’ll patch issues quickly in the next pass.