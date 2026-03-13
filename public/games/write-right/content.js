const gameData = {
    // Data extracted from the provided PDF
    topics: [
        { id: 1, text: 'You are Asha/Arjun of Class XII. Write on "Media Literacy: A Survival Skill in the Digital Age" for the newspaper.', type: 'Article', byline: 'By Asha/Arjun, Class XII' },
        { id: 2, text: 'You are the Cultural Secretary of your school. Recently, your school organized a Tree Plantation Drive in collaboration with the local NGO. Report the same for the school newsletter.', type: 'Report', byline: 'By [Your Name], Cultural Secretary' },
        { id: 3, text: 'You are to deliver a speech in the morning assembly on the topic "Importance of Sports and Games in Student Life". Write the same.', type: 'Speech', byline: '' },
        { id: 4, text: '"Online Education is Better than Traditional Schooling". Give your views in favour or against the motion.', type: 'Debate', byline: '' },
        { id: 5, text: 'Write something in 120 words approximately on "Impact of Fast Food on Teenagers\' Health" to be published in your school magazine.', type: 'Article', byline: 'By [Your Name]' }
    ],
    formats: {
        Article: {
            correct_sequence: ["TITLE", "BYLINE", "CONTENT"],
            pool: ["TITLE", "BYLINE", "CONTENT", "SUBJECT", "DESIGNATION"]
        },
        Report: {
            correct_sequence: ["TITLE", "BYLINE", "CONTENT"],
            pool: ["TITLE", "BYLINE", "CONTENT", "SUBJECT", "DESIGNATION"]
        },
        Speech: {
            correct_sequence: ["INTRODUCTION", "CONTENT", "THANK YOU"],
            pool: ["INTRODUCTION", "CONTENT", "THANK YOU", "BYLINE", "TITLE"]
        },
        Debate: {
            correct_sequence: ["INTRODUCTION", "CONTENT", "THANK YOU"],
            pool: ["INTRODUCTION", "CONTENT", "THANK YOU", "BYLINE", "TITLE", "DESIGNATION"]
        }
    },
    content: {
        1: { // Media Literacy
            words: {
                relevant: ["Information", "Misinformation", "Critical thinking", "Social media", "Fake news", "Awareness", "Technology", "Digital citizens", "Bias", "Responsibility"],
                irrelevant: ["Volcano", "Canteen", "Raincoat", "Birthday party", "Chalk", "Himalayas", "Football match", "Banana", "Soap", "Traffic jam"]
            },
            sentences: {
                relevant: [
                    "Media literacy empowers people to question the reliability of information before accepting it as truth.",
                    "It helps citizens become responsible consumers of news in a digital age filled with misinformation.",
                    "Media literacy develops critical thinking by teaching people to analyze messages, images, and hidden motives.",
                    "Understanding media ownership and sponsorship reveals possible bias in the content we consume.",
                    "Teaching students to identify credible sources promotes informed decision-making.",
                    "Media literacy reduces the risk of manipulation through advertisements, political propaganda, or fake news.",
                    "Practising cross-checking facts with multiple sources strengthens accuracy in understanding.",
                    "Developing media literacy encourages empathy by exposing learners to diverse perspectives.",
                    "It enables people to create responsible content themselves, not just consume it.",
                    "Schools, parents, and communities can develop media literacy through workshops, debates, and guided use of digital tools."
                ],
                irrelevant: [
                    "Reading books regularly improves vocabulary.",
                    "Memorizing dates of history may help in exams.",
                    "Knowing how to solve math problems improves logical thinking.",
                    "Watching entertainment shows can be relaxing.",
                    "Learning a foreign language builds communication skills."
                ]
            },
            paragraphs: {
                relevant: [
                    "Media literacy empowers people to question the reliability of information before accepting it as truth. It helps citizens become responsible consumers of news in a digital age filled with misinformation. Practising cross-checking facts with multiple sources strengthens accuracy in understanding.",
                    "Media literacy develops critical thinking by teaching people to analyze messages, images, and hidden motives. Understanding media ownership and sponsorship reveals possible bias in the content we consume. Media literacy also reduces the risk of manipulation through advertisements, political propaganda, or fake news.",
                    "Teaching students to identify credible sources promotes informed decision-making. Developing media literacy encourages empathy by exposing learners to diverse perspectives. It enables people to create responsible content themselves, not just consume it, and schools, parents, and communities can develop media literacy through workshops, debates, and guided use of digital tools."
                ],
                irrelevant: [
                    "Reading books regularly improves vocabulary. Memorizing dates of history may help in exams. Knowing how to solve math problems improves logical thinking.",
                    "Watching entertainment shows can be relaxing. Learning a foreign language builds communication skills. But these are not directly connected with understanding media messages or avoiding misinformation.",
                    "While all these skills are useful for students in general, they do not equip people to detect bias, analyze content, or resist manipulation. Hence, they remain unrelated to the urgent need for media literacy in the digital age."
                ]
            }
        },
        2: { // Tree Plantation
            words: {
                relevant: ["Plantation", "NGO collaboration", "Saplings", "Awareness session", "Environment", "Responsibility", "Pledge", "Students participation", "Ecological balance", "Success"],
                irrelevant: ["Exhibition", "Donation drive", "Flower show", "Recycling competition", "Annual day", "Cultural fest", "Debate on pollution", "Poster-making contest", "Heritage walk", "Sports meet"]
            },
            sentences: {
                 relevant: [
                    "The drive was inaugurated by our Principal along with the President of the NGO.",
                    "Teachers, students, and members of the local community participated with great enthusiasm.",
                    "The Chief Guest, the Municipal Commissioner, highlighted the importance of trees in combating climate change.",
                    "More than 200 saplings of neem, banyan, and mango were planted around the school campus and nearby park.",
                    "Students took an oath to water and care for the saplings regularly.",
                    "The NGO volunteers guided us on how to nurture young plants.",
                    "Planting trees is vital as they provide oxygen, improve air quality, and reduce pollution.",
                    "They also offer shade, prevent soil erosion, and support biodiversity.",
                    "The event spread awareness about the urgent need for afforestation in urban spaces.",
                    "The drive concluded successfully with the hope of turning our surroundings greener and healthier."
                ],
                irrelevant: [
                   "Some students were more excited about taking group photos than planting trees.",
                   "A few volunteers suggested organizing a cultural program after the drive, but it was postponed.",
                   "Snacks and refreshments were served, which became the highlight for many participants.",
                   "Several students expressed that they preferred painting competitions to outdoor activities.",
                   "The Principal reminded everyone about the upcoming Annual Sports Day during her closing remarks."
                ]
            },
            paragraphs: {
                 relevant: [
                    "Our school recently organized a Tree Plantation Drive in collaboration with a local NGO. The event was inaugurated by our Principal along with the President of the NGO. Teachers, students, and members of the local community participated with great enthusiasm, making it a truly collective effort.",
                    "The Chief Guest, the Municipal Commissioner, highlighted the importance of trees in combating climate change. More than 200 saplings of neem, banyan, and mango were planted around the school campus and the nearby park. Students also took an oath to water and care for the saplings regularly under the guidance of the NGO volunteers.",
                    "The drive spread awareness about the urgent need for afforestation in urban spaces. Planting trees is vital as they provide oxygen, improve air quality, reduce pollution, and support biodiversity. The event concluded successfully with the hope of turning our surroundings greener and healthier."
                ],
                irrelevant: [
                    "Some students were more excited about taking group photos than planting trees. A few volunteers even suggested organizing a cultural program after the drive, but it had to be postponed.",
                    "Snacks and refreshments were served, which became the highlight for many participants. Several students expressed that they preferred painting competitions to outdoor activities.",
                    "The Principal also reminded everyone about the upcoming Annual Sports Day during her closing remarks. While this announcement was important, it was not directly related to the plantation drive."
                ]
            }
        },
        3: { // Sports and Games
            words: {
                relevant: ["Fitness", "Discipline", "Teamwork", "Perseverance", "Stress relief", "Confidence", "Balance", "Healthy mind", "Participation", "Success", "Flexibility"],
                irrelevant: ["Annual exam", "Cultural fest", "Debate competition", "Musical performance", "Science exhibition", "Quiz contest", "Morning assembly prayer", "Library reading", "Art workshop", "Computer lab session"]
            },
            sentences: {
                relevant: [
                    "Sports and games play a vital role in shaping the overall personality of students.",
                    "They help in maintaining physical fitness and keeping our minds fresh.",
                    "Participation in games builds discipline, teamwork, and leadership qualities.",
                    "Sports teach us how to accept victory with humility and defeat with grace.",
                    "Regular involvement in physical activities reduces stress and improves concentration.",
                    "Schools should encourage students by organizing inter-house and inter-school competitions.",
                    "Students can also join sports clubs and practice regularly to enhance their skills.",
                    "Outdoor games like football, cricket, and hockey develop stamina and strength.",
                    "Indoor games such as chess and table tennis improve mental sharpness and decision-making.",
                    "Sports are not just hobbies but essential life lessons that prepare us for future challenges."
                ],
                irrelevant: [
                    "Many students are more interested in annual cultural programs than in playing games.",
                    "Some feel that spending time in the library is more useful than playing on the ground.",
                    "Students often prefer watching sports on television rather than participating actively.",
                    "A few believe that academic achievements alone are enough for a successful career.",
                    "Refreshments served during sports events sometimes attract more students than the matches themselves."
                ]
            },
            paragraphs: {
                relevant: [
                    "Sports and games play a vital role in shaping the overall personality of students. They not only maintain physical fitness but also keep our minds fresh and active. Outdoor games like football, cricket, and hockey develop stamina and strength, while indoor games such as chess and table tennis improve mental sharpness and decision-making.",
                    "Participation in sports helps in building discipline, teamwork, and leadership qualities. It teaches us to accept victory with humility and defeat with grace, which are essential values in life. Sports are not just hobbies but important life lessons that prepare us for future challenges.",
                    "Regular involvement in physical activities also reduces stress and improves concentration. Schools should encourage students by organizing inter-house and inter-school competitions, while students can further enhance their skills by joining sports clubs and practising regularly."
                ],
                irrelevant: [
                    "Many students are more interested in annual cultural programs than in playing games. Some even feel that spending time in the library is more useful than being out on the playground.",
                    "Students often prefer watching sports on television rather than participating actively. A few also believe that academic achievements alone are enough for a successful career.",
                    "Refreshments served during sports events sometimes attract more students than the matches themselves. While these points may reflect reality, they do not truly reflect the value of sports in shaping our lives."
                ]
            }
        },
        4: { // Online Education
            words: {
                relevant: ["Flexibility", "Accessibility", "Independent learning", "Social interaction", "Digital literacy", "Communication skills", "Discipline", "Health concerns", "Time-saving", "Holistic development"],
                irrelevant: ["School picnic", "Annual sports day", "Cultural fest", "Library week", "Hostel life", "School canteen", "Uniform rules", "Parent-teacher meeting", "School bus facility", "Farewell party"]
            },
            sentences: {
                relevant: [
                    "Online education provides flexibility of time and place for students and teachers.",
                    "It allows access to a vast variety of resources like e-books, videos, and global experts.",
                    "Students can learn at their own pace, revising recorded lessons whenever needed.",
                    "Online platforms reduce commuting time and expenses for both students and parents.",
                    "Technology integration prepares students for a digitally driven future.",
                    "Traditional schooling provides face-to-face interaction that builds social and communication skills.",
                    "Online education often lacks discipline and can make students less focused.",
                    "Technical issues like poor internet connectivity hinder effective learning.",
                    "Teachers can better assess body language, attention, and participation in physical classrooms.",
                    "Traditional schools offer extracurricular activities like sports and cultural events, absent online."
                ],
                irrelevant: [
                    "Some students enjoy lunch breaks with friends more than actual classes.",
                    "Parents often prefer uniforms because they create equality, though this doesn't affect online learning.",
                    "School buses help in time management but have little to do with quality of education.",
                    "Online learning doesn't require a playground, but many students miss playing games during breaks.",
                    "Traditional schools have morning assemblies, which may not directly affect academic learning."
                ]
            },
            paragraphs: {
                relevant: [
                    "Online education has emerged as a powerful mode of learning as it provides flexibility of time and place to both teachers and students. Learners can access a wide range of resources like e-books, videos, and expert lectures from across the globe, which enhances their knowledge base. Moreover, the opportunity to revisit recorded lessons enables students to learn at their own pace. It also reduces commuting time and expenses, making education more affordable and convenient, while preparing students for a digitally driven future through constant use of technology.",
                    "However, online learning comes with its share of challenges. Students often struggle with maintaining discipline and focus in a virtual environment, which can affect their performance. Technical issues such as poor internet connectivity also create interruptions, limiting the effectiveness of lessons. Unlike physical classrooms, online platforms make it difficult for teachers to observe students' body language, attention, and participation, leading to gaps in monitoring and evaluation.",
                    "Traditional schooling, on the other hand, offers experiences beyond academics. Face-to-face interaction helps students develop social and communication skills, which are essential for overall growth. Schools also provide extracurricular activities like sports, cultural events, and group projects that foster teamwork, creativity, and leadership—opportunities that are largely absent in online education. Thus, while both modes have their strengths and drawbacks, a blended approach may ensure the best of both worlds."
                ],
                irrelevant: [
                    "Online education has become an effective mode of learning as it provides flexibility of time and place to teachers and students. It offers access to a variety of resources such as e-books, videos, and expert lectures from across the world. Students can revisit recorded lessons to learn at their own pace, while reduced commuting time and expenses make education more affordable and convenient. At the same time, regular use of digital platforms equips learners with skills required for a technology-driven future.",
                    "Yet, online education has its limitations. Many students struggle with discipline and focus in a virtual setting, and technical problems like poor internet connectivity often disrupt learning. Unlike traditional classrooms, teachers cannot easily assess students' body language or attention online, leading to gaps in understanding. Moreover, schools provide face-to-face interaction and extracurricular opportunities such as sports and cultural events, which build social, communication, and leadership skills. Hence, a balanced approach that blends online and traditional methods may ensure the most effective form of education."
                ]
            }
        },
        5: { // Fast Food
             words: {
                relevant: ["Obesity", "Junk food", "Lifestyle diseases", "Nutrition", "Concentration", "Immunity", "Convenience", "Balanced diet", "Energy levels", "Teenagers"],
                irrelevant: ["School picnic", "Birthday celebration", "Street fashion", "Cultural fest", "Sports meet", "Library books", "Social media trends", "Examination stress", "School canteen gossip", "Farewell party"]
            },
            sentences: {
                relevant: [
                    "Fast food is highly popular among teenagers due to its taste and easy availability.",
                    "It often replaces homemade balanced meals in daily life.",
                    "Regular intake leads to obesity and weight-related problems.",
                    "Such foods are rich in fats, sugar, and salt but poor in nutrition.",
                    "They can cause vitamin and protein deficiencies in growing bodies.",
                    "Frequent consumption increases the risk of diabetes at a young age.",
                    "Excess junk food may also lead to heart problems later in life.",
                    "It weakens concentration levels and reduces immunity.",
                    "Parents and schools must spread awareness about healthy eating.",
                    "Physical exercise and moderation can reduce the harmful effects."
                ],
                irrelevant: [
                    "Teenagers often visit fast food outlets more for socializing than for eating.",
                    "Many like fast food mainly because of attractive packaging.",
                    "Some teens post pictures of their meals on social media rather than finishing them.",
                    "Fast food chains attract youth with discounts and festive offers.",
                    "Occasional free toys in combo meals make them more appealing to younger students."
                ]
            },
            paragraphs: {
                relevant: [
                    "Fast food has become extremely popular among teenagers because of its delicious taste and easy availability. For many, it often replaces homemade balanced meals, gradually becoming a part of their daily lifestyle. While it may seem convenient, frequent consumption of such food items can have serious consequences on health, especially in the growing years of life.",
                    "These foods are usually high in fats, sugar, and salt but lack essential nutrients like vitamins and proteins. Regular intake can lead to obesity, reduced immunity, and poor concentration levels in students. More alarming is the increased risk of lifestyle diseases such as diabetes at a young age and heart problems later in life. Such habits not only affect physical health but also impact mental alertness and energy levels.",
                    "To counter these harmful effects, awareness about healthy eating must be spread by both parents and schools. Encouraging children to include fresh fruits, vegetables, and homemade meals in their diet is essential. Alongside, physical exercise and moderation in consuming fast food can help maintain good health and ensure that students grow into fit, active, and responsible individuals."
                ],
                irrelevant: [
                    "Fast food has become more than just a meal for teenagers; it is often a means of socializing. Many students visit outlets not only to eat but also to spend time with friends in a casual environment. The colorful and attractive packaging makes fast food even more appealing, while the trend of posting meal pictures on social media shows how it is linked with lifestyle and peer influence rather than just hunger.",
                    "Oddly, some teenagers admit that they like going there because they believe the chairs are more comfortable than their classroom desks. In rare cases, students even talk about how the smell of fries helps them concentrate on homework, though there is no evidence of this. Such unusual perceptions create excitement and curiosity."
                ]
            }
        }
    }
};
