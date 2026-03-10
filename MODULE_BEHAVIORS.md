# Module Behaviors

## Subject -> Output Language Lock

- Language subjects: `English`, `Hindi`, `Sanskrit`
- Mapping:
  - `English` -> output `English`
  - `Hindi` / `Sanskrit` -> output `Hindi`
- Non-language subjects: output language stays user-selectable.
- Reuse shared utility only: `lib/languageSubject.ts`
  - `getSubjectLanguageRule()`
  - `applySubjectLanguageRule()`

## Reusability First

- Prefer shared utilities/components over module-specific duplicates.
- If logic/UI repeats across modules, extract to `lib/*` or `components/shared/*`.

## Multimodal Context Input

- Context file upload should be available wherever topic/context-style inputs exist and it is applicable.
- Keep it **optional** (never required for submission).
- Provide separate actions: `Upload File` and `Use Camera`.
- Reuse:
  - `components/shared/ContextFileUpload.tsx`
  - `lib/contextFiles.ts`

## Voice Input Assist

- Add optional speech-to-text assist for major text fields (topic/description/context style inputs).
- User flow: record -> review/edit draft -> click insert into main field.
- Reuse: `components/shared/VoiceInputAssist.tsx`
