FLEXIBLE CUSTOMIZATION

- all subject options discussed so far.
- 4 duration options: 30, 40, 50, 60 minutes
- Grade levels 1-10 with age-appropriate content
- Optional learning objectives for personalized focus



Lesson plans follow established educational frameworks:

- Gradual Release of Responsibility model
- Bloom's Taxonomy for cognitive progression
- Differentiated instruction principles
- Formative and summative assessment integration



TECHNICAL ARCHITECTURE

INPUT PROCESSING
User inputs undergo validation for required fields (subject, duration, topic, grade level) and optional objectives. The system ensures all necessary information is present before processing.



PEDAGOGICAL PLANNING ENGINE
This core component analyzes lesson requirements and determines:

- Time allocation percentages for each phase
- Appropriate activities for the grade level
- Assessment strategies matching the topic
- Classroom management considerations



PARALLEL PROCESSING SYSTEM

- all prompts constructed simultaneously for all the sections we have
- ONE SINGLE API call to Gemini 2.5 Flash-Lite API



PROMPT ENGINEERING PIPELINE
Each section has specialized prompt construction:

- Base context (subject, topic, duration, grade, objectives etc) 
- Section-specific requirements and structure
- Timing calculations for lesson phases
- Assessment item specifications
- Practical tip categories



RESPONSE INTEGRATION
Generated sections undergo:

- Individual validation for completeness
- Markdown formatting for readability
- Integration into unified lesson plan object
- Metadata attachment for reference



TIME ALLOCATION STRATEGY  
The system automatically calculates phase durations based on total lesson time such that these percentages ensure balanced lessons with adequate time for each learning phase.



GRADE-LEVEL ADAPTATION
Lesson complexity, activity types, and assessment methods are tailored:

- Lower grades: Hands-on activities, concrete examples, simpler assessments
- Middle grades: Mix of concrete and abstract, group work, varied assessments
- Upper grades: Abstract concepts, complex tasks, sophisticated assessments



WORKFLOW

1. Teacher selects subject and grade level
2. Teacher chooses lesson duration (30/40/50/60 minutes)
3. Teacher enters topic , information and optional learning objectives
4. Frontend validates inputs and sends POST request to /api/planner/generate
5. Backend controller validates and extracts parameters
6. Pedagogical planning engine analyzes requirements
7. prompt construction to be sent to the api. 
8. ONE single API call to Gemini generates all sections
9. Response parser validates and formats each section
10. Sections integrated into complete lesson plan
11. Frontend displays with tabbed interface for easy navigation
12. Teacher can switch between different tabs.

