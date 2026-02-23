WORKSHEET MODULE   
Differentiated Worksheet Generation System

The Worksheet Module is designed to generate differentiated educational worksheets tailored to multiple grade levels simultaneously. This module employs intelligent content adaptation algorithms to ensure that worksheets are appropriately challenging and pedagogically sound for each selected grade level. By generating multiple versions of worksheets from a single prompt, educators save significant time while ensuring content relevance across diverse classroom settings.

MULTI-GRADE DIFFERENTIATION  
The core feature of this module is its ability to create separate worksheet versions for multiple grade levels in a single request. Users can select any combination of grades from 1 to 10, and the system generates appropriately differentiated content for each selected grade.

- subject input: all relevant subjects, including but not limited to: EVS, Science, Maths, English, Hindi, Social Sciences etc whatever subjects are usually there for cbse or rural vernacular boards syllabus in India. 
- output language : choose content in english or hindi etc. 
-  topic input : allows for specific curriculum alignment
- Details field: Content reference field enables context-specific worksheet generation, could either be text that the teacher has written in the text box, or attached pdf or images etc. 

Four distinct worksheet formats are supported:

- Multiple Choice Questions (MCQ): 10-15 questions with 4 options each
- Short Answer: 10 questions requiring 2-3 sentence responses
- Long Answer: 8 questions requiring detailed longer responses
- Fill in the Blanks: 10 statements with word banks provided



TECHNICAL ARCHITECTURE

INPUT PROCESSING  
User inputs are validated for completeness (subject, topic, content, worksheet type, output language etc whatever discussed earlier,, and at least one grade level). The system performs format validation before passing data to the processing layer.

DIFFERENTIATION ENGINE
The differentiation engine is the core processing component that analyzes grade level requirements and constructs tailored prompts for the AI service. It implements:

- Vocabulary complexity adjustment based on grade level
- Conceptual depth variation (basic concepts for lower grades, advanced for higher grades)
- Question complexity scaling
- Example appropriateness matching to grade level

PROMPT ENGINEERING PIPELINE
Sophisticated prompt construction ensures high-quality output:

- Base context establishment (subject, topic, content reference)
- Grade-specific instructions for each selected grade
- Worksheet type-specific formatting requirements
- Language and cultural context specifications
- Output structure guidelines (headings, numbering, answer keys)

AI GENERATION SERVICE  
The system utilizes Google Gemini 2.5 Flash-lite API for content generation. The prompt is carefully engineered to produce structured, grade-differentiated content in a single API call, maximizing efficiency while maintaining quality.

RESPONSE FORMATTING
Generated content undergoes post-processing:

- Markdown formatting for rich text display
- Structure validation to ensure all grade levels are represented
- Answer key verification (answers at end of worksheet)
- Metadata attachment (grades, subject, topic, timestamp)



WORKFLOW

1. User selects grade levels (multiple selection supported)
2. User provides subject, topic, content description, worksheet type, and language
3. Frontend validates inputs and sends POST request to /api/worksheets/generate
4. Backend controller validates and passes to differentiation engine
5. Prompt builder constructs grade-specific, type-specific prompt
6. Single API call to Gemini generates all worksheet versions
7. Response parser extracts and validates generated content
8. Formatted response with metadata sent to frontend
9. React-markdown renders content with proper formatting
10. User can view, copy, or regenerate worksheets



DIFFERENTIATION STRATEGY

The module implements a three-tier differentiation strategy:

VOCABULARY LEVEL
Lower grades receive simpler vocabulary, while higher grades incorporate subject-specific terminology and advanced language structures.

CONCEPTUAL COMPLEXITY

- Grades 1-3: Basic recall and simple understanding
- Grades 4-6: Application of concepts with moderate reasoning
- Grades 7-10: Complex analysis, synthesis, and evaluation

QUESTION DEPTH
Questions are tailored to cognitive abilities at each grade level, following Bloom's Taxonomy principles adapted for Indian educational contexts.





- Single API call generates multiple grade-level worksheets
- Reduces generation time compared to sequential grade-by-grade creation
- Cost-effective bulk generation
- instead of giving different classes worksheet (if multiple classes chosen) one after the other, make tabs type thing where the classes can be chosen like tab.
- for all selection fields, use pill button type selection.

