export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: BlogBlock[];
  author: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  thumbnail?: string;
}

export const AUTHOR = 'Dr. Srinivasa C';

export const blogs: Blog[] = [
  {
    id: '1',
    title: 'Rheumatoid Arthritis',
    excerpt:
      'Rheumatoid arthritis is a chronic autoimmune condition that causes joint pain, swelling and inflammation. Learn the symptoms, risk factors, complications, and how it is diagnosed and treated.',
    content: [
      {
        type: 'heading',
        text: 'What is Rheumatoid Arthritis (RA)?',
      },
      {
        type: 'paragraph',
        text: 'Rheumatoid arthritis is a chronic autoimmune condition that causes pain, swelling, and irritation (inflammation) in the joints. It can damage other parts of the body. These may include the skin, eyes, lungs, heart and blood vessels.',
      },
      {
        type: 'paragraph',
        text: 'The immune system protects us from infections. But in RA, it mistakenly attacks the joint lining. Rheumatoid arthritis affects the lining of the joints and eats away at the bone under them. This causes a painful swelling that can cause joints to bend out of shape over time, called deformity.',
      },
      {
        type: 'paragraph',
        text: 'New medicines have greatly improved treatment choices. But rheumatoid arthritis still can cause long-term damage and increase the risk of heart disease.',
      },
      {
        type: 'paragraph',
        text: 'The tissue that lines the joints, called the synovial membrane, becomes inflamed and fluid builds up. As a result, joints can bend out of shape, becoming deformed.',
      },
      {
        type: 'heading',
        text: 'Symptoms of RA',
      },
      {
        type: 'paragraph',
        text: 'RA symptoms include:',
      },
      {
        type: 'list',
        items: [
          'Pain, aching, or stiffness in more than one joint',
          'Tenderness, redness, warmth, and swelling in joints',
          'Weight loss',
          'Fever',
          'Fatigue or tiredness',
          'Weakness',
        ],
      },
      {
        type: 'paragraph',
        text: 'People with RA may experience:',
      },
      {
        type: 'list',
        items: [
          'Flares — when symptoms suddenly appear or get worse',
          'Remission — when symptoms get better or go away',
        ],
      },
      {
        type: 'heading',
        text: 'Risk Factors',
      },
      {
        type: 'paragraph',
        text: 'The exact cause of rheumatoid arthritis is unknown, but it is believed to involve a combination of genetic and environmental factors. Risk factors include:',
      },
      {
        type: 'list',
        items: [
          'Gender: Women are more likely to develop RA than men.',
          'Family history: Having a family member with rheumatoid arthritis or other autoimmune conditions may raise the risk.',
          'Lifestyle factors: Smoking, obesity, gum infections and other unhealthy lifestyle habits may increase the risk of getting RA.',
          'Age: Rheumatoid arthritis can happen at any age, but most often it begins in middle age. Children and young teens may get a related condition called juvenile idiopathic arthritis.',
        ],
      },
      {
        type: 'heading',
        text: 'Complications',
      },
      {
        type: 'list',
        items: [
          'Osteoporosis',
          'Rheumatoid nodules',
          'Dry eyes and mouth',
          'Infections',
          'Carpal tunnel syndrome',
          'Heart problems',
          'Lung disease',
          'Lymphoma',
        ],
      },
      {
        type: 'heading',
        text: 'Treatment and Diagnosis',
      },
      {
        type: 'paragraph',
        text: 'Rheumatoid arthritis is diagnosed through a combination of medical assessments. A rheumatologist reviews the patient\'s symptoms and medical history and examines the joints. Blood tests can help detect inflammation and certain antibodies. X-rays or ultrasound may also be used. No single test can confirm or rule out every case, so the doctor considers all findings.',
      },
      {
        type: 'paragraph',
        text: 'Although rheumatoid arthritis has no established cure, effective treatments can help control inflammation and protect the joints. Doctors may prescribe disease-modifying medicines, called DMARDs. Regular follow-ups help monitor the condition. Gentle exercises can help maintain joint movement, flexibility and strength. Activities should be adapted to the person\'s comfort and medical advice. Early treatment can reduce the risk of long-term joint damage.',
      },
    ],
    author: AUTHOR,
    date: '2026-10-16',
    readTime: '5 min read',
    category: 'Arthritis',
    slug: 'rheumatoid-arthritis',
    thumbnail: '/images/blog-rheumatoid-arthritis.jpg',
  },
  {
    id: '2',
    title: 'Fibromyalgia',
    excerpt:
      'Fibromyalgia causes widespread pain, fatigue, sleep problems and “fibro fog.” Learn the symptoms, causes, risk factors and complications.',
    content: [
      {
        type: 'heading',
        text: 'What is Fibromyalgia?',
      },
      {
        type: 'paragraph',
        text: 'Fibromyalgia is a chronic disorder involving widespread musculoskeletal pain, persistent fatigue, sleep disturbances, and cognitive issues such as difficulty concentrating. It results from altered pain processing in the central nervous system, making individuals more sensitive to pain signals.',
      },
      {
        type: 'paragraph',
        text: 'Fibromyalgia (FM) is a long-term condition characterized by widespread chronic pain. Other symptoms can include fatigue, trouble thinking or remembering, waking up tired (unrefreshed), pain or cramps in the lower abdomen, depression, or headache.',
      },
      {
        type: 'heading',
        text: 'Symptoms',
      },
      {
        type: 'list',
        items: [
          'Widespread pain: A persistent, dull ache that lasts for at least three months. The pain is considered widespread when it affects both sides of the body, including areas above and below the waist.',
          'Fatigue: People with fibromyalgia often wake up feeling tired, even after sleeping for long hours. Pain can interfere with sleep, and they may also experience restless legs syndrome or sleep apnea.',
          'Difficulty with thinking and concentration: A common symptom known as “fibro fog” can make it difficult to concentrate, pay attention, remember things, and focus on mental tasks.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Fibromyalgia can also occur alongside other health conditions, including:',
      },
      {
        type: 'list',
        items: [
          'Irritable bowel syndrome (IBS)',
          'Chronic fatigue syndrome',
          'Migraine and other types of headaches',
          'Interstitial cystitis, also known as painful bladder syndrome',
          'Temporomandibular joint (TMJ) disorders',
          'Anxiety and depression',
        ],
      },
      {
        type: 'heading',
        text: 'Causes and Risk Factors',
      },
      {
        type: 'paragraph',
        text: 'The exact cause of fibromyalgia is not fully understood. However, it is believed to develop due to a combination of genetic, biological, and environmental factors. The condition is associated with changes in how the brain and nervous system process pain, making a person more sensitive to painful and sometimes non-painful sensations.',
      },
      {
        type: 'heading',
        text: 'Causes of Fibromyalgia',
      },
      {
        type: 'list',
        items: [
          'Genetic factors: Certain genetic variations may increase a person\'s susceptibility to developing fibromyalgia, particularly when the condition runs in the family.',
          'Physical or emotional stress: Severe stress, emotional trauma, or prolonged psychological strain may contribute to the development of symptoms in some individuals.',
          'Infections and illnesses: Some people develop fibromyalgia symptoms following an infection or another illness, although infections are not a direct cause in every case.',
          'Sleep disturbances: Poor sleep quality may worsen pain sensitivity and fatigue and can contribute to the persistence of symptoms.',
        ],
      },
      {
        type: 'heading',
        text: 'Risk Factors for Fibromyalgia',
      },
      {
        type: 'paragraph',
        text: 'Certain factors may increase the likelihood of developing fibromyalgia, although having one or more risk factors does not necessarily mean a person will develop the condition.',
      },
      {
        type: 'list',
        items: [
          'Family history: People who have a close family member with fibromyalgia may have a higher risk of developing the condition.',
          'Physical injury or trauma: Serious injuries, accidents, or surgical procedures may trigger symptoms in some susceptible individuals.',
          'Emotional stress and trauma: Prolonged stress or significant emotional experiences may contribute to the onset of symptoms.',
          'Sleep problems: Persistent sleep disturbances may worsen pain sensitivity and fatigue, although they are not established as a direct cause of fibromyalgia.',
        ],
      },
      {
        type: 'heading',
        text: 'Complications',
      },
      {
        type: 'paragraph',
        text: 'The pain, fatigue, and poor sleep linked with fibromyalgia can affect your personal life and career. It also can be stressful to live with a condition that\'s often misunderstood by others. That can lead to mental health conditions such as depression and anxiety.',
      },
    ],
    author: AUTHOR,
    date: '2026-10-16',
    readTime: '5 min read',
    category: 'Pain',
    slug: 'fibromyalgia',
    thumbnail: '/images/blog-fibromyalgia.jpg',
  },
  {
    id: '3',
    title: 'Lupus',
    excerpt:
      'Lupus (SLE) is a chronic autoimmune disease that can affect the skin, joints, kidneys and other organs. Learn the symptoms, diagnosis, management, and common myths vs facts.',
    content: [
      {
        type: 'heading',
        text: 'What Is Lupus?',
      },
      {
        type: 'paragraph',
        text: 'Understanding an Autoimmune Disease',
      },
      {
        type: 'paragraph',
        text: 'Lupus, also known as Systemic Lupus Erythematosus (SLE), is a chronic autoimmune disease in which the immune system mistakenly attacks healthy tissues. It can affect the skin, joints, kidneys, heart, lungs and other organs.',
      },
      {
        type: 'heading',
        text: 'Common Symptoms of Lupus',
      },
      {
        type: 'list',
        items: [
          'Persistent fatigue',
          'Joint pain and swelling',
          'Skin rashes, sometimes across the cheeks and nose',
          'Sensitivity to sunlight',
          'Fever without a clear cause',
          'Hair loss in some people',
        ],
      },
      {
        type: 'heading',
        text: 'How Is Lupus Diagnosed?',
      },
      {
        type: 'paragraph',
        text: 'There is no single test that confirms lupus in every person. Doctors assess symptoms, medical history, physical examination and appropriate blood and urine tests. Tests such as ANA may help support the diagnosis, but a positive ANA result alone does not mean a person has lupus.',
      },
      {
        type: 'heading',
        text: 'Can Lupus Be Managed?',
      },
      {
        type: 'paragraph',
        text: 'Although lupus has no universal cure, appropriate treatment can help control inflammation, manage symptoms and reduce organ damage. Regular medical follow-up is important.',
      },
      {
        type: 'paragraph',
        text: 'Remember: Symptoms vary from person to person. Early medical evaluation can help people receive appropriate care.',
      },
      {
        type: 'heading',
        text: 'Lupus Myth and Fact',
      },
      {
        type: 'list',
        items: [
          'Myth: It is a form of cancer or HIV/AIDS. Fact: Lupus is an autoimmune disease, not cancer or an immunodeficiency. While HIV weakens the immune system, lupus makes the immune system overactive, causing it to mistakenly attack healthy organs and tissues.',
          'Myth: Lupus is contagious. Fact: Lupus is completely non-contagious. You cannot catch it, transmit it, or give it to someone else through physical contact, saliva, or proximity.',
          'Myth: Only adult women get lupus. Fact: Men, teens, and children can also develop lupus. While roughly 90% of cases are diagnosed in women, men can develop it and often experience more severe complications affecting the kidneys and heart.',
          'Myth: If you don’t look sick, you aren’t sick. Fact: Lupus is a classic “invisible illness.” While some experience a visible malar (butterfly) rash across the face, many experience internal symptoms like severe fatigue, joint pain, and organ inflammation that are completely hidden.',
          'Myth: Women with lupus cannot get pregnant. Fact: Most women with lupus can have successful, healthy pregnancies. These pregnancies are classified as high-risk and require careful medical planning, but with proper monitoring, safe childbirth is highly achievable.',
          'Myth: Lupus is a death sentence. Fact: It is not a death sentence. While there is currently no cure, modern medical advancements, tailored therapies, and lifestyle adjustments allow the vast majority of people with lupus to live a normal or near-normal lifespan.',
        ],
      },
    ],
    author: AUTHOR,
    date: '2026-10-16',
    readTime: '5 min read',
    category: 'Autoimmune',
    slug: 'lupus',
    thumbnail: '/images/blog-lupus.jpg',
  },
  {
    id: '4',
    title: 'Osteoporosis',
    excerpt:
      'Osteoporosis weakens bones silently until a fracture occurs. Learn the symptoms, causes, treatment options and how to prevent bone loss.',
    content: [
      {
        type: 'heading',
        text: 'What is Osteoporosis?',
      },
      {
        type: 'paragraph',
        text: 'Osteoporosis occurs when the body loses too much bone, makes too little bone, or both. As a result, bones become porous and break more easily. It is often called a “silent disease” because bone loss happens without symptoms until a fracture occurs.',
      },
      {
        type: 'paragraph',
        text: 'Osteoporosis is a condition in which bones become weak, brittle, and more likely to break due to reduced bone density.',
      },
      {
        type: 'heading',
        text: 'Symptoms',
      },
      {
        type: 'list',
        items: [
          'Bones breaking easily',
          'Back pain',
          'Loss of height over time',
          'Stooped posture',
          'Often, no symptoms until a fracture occurs',
          'Shortness of breath',
          'High-impact fractures',
        ],
      },
      {
        type: 'heading',
        text: 'Causes',
      },
      {
        type: 'list',
        items: [
          'Ageing',
          'Lack of calcium and vitamin D',
          'Hormonal changes, especially after menopause',
          'Lack of physical activity',
          'Family history of osteoporosis',
          'Smoking and excessive alcohol consumption',
          'Certain medical conditions and long-term use of some medicines',
          'Poor nutrition',
        ],
      },
      {
        type: 'heading',
        text: 'Treatment',
      },
      {
        type: 'paragraph',
        text: '1. Exercise — Regular exercise helps strengthen bones and muscles and improves balance. Examples include walking, yoga and Pilates.',
      },
      {
        type: 'paragraph',
        text: '2. Calcium and Vitamin D — Calcium and vitamin D supplements may be recommended by a doctor to keep bones strong.',
      },
      {
        type: 'paragraph',
        text: '3. Medications — Doctors may prescribe medicines such as bisphosphonates or hormone therapy to strengthen bones and reduce the risk of fractures.',
      },
      {
        type: 'paragraph',
        text: '4. DEXA scans — Bone density (DEXA) scans help diagnose osteoporosis and guide treatment.',
      },
      {
        type: 'heading',
        text: 'Prevention',
      },
      {
        type: 'list',
        items: [
          'Eat calcium-rich foods such as milk, curd, and leafy green vegetables.',
          'Get enough vitamin D through safe sunlight exposure and diet.',
          'Exercise regularly, especially weight-bearing activities.',
          'Avoid smoking and alcohol.',
          'Maintain a balanced diet and seek medical advice when needed.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Remember: Osteoporosis is often called a silent disease because bones can weaken without noticeable symptoms.',
      },
    ],
    author: AUTHOR,
    date: '2026-10-16',
    readTime: '4 min read',
    category: 'Bone Health',
    slug: 'osteoporosis',
    thumbnail: '/images/blog-osteoporosis.jpg',
  },
];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug === slug);
}
