[
    {
      pageNumber: 0,
      questions: [
        {
          id: 'intent-to-file',
          label: 'Are you intending to file a claim or increase your current rating for this condition?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      pageNumber: 1,
      questions: [
        {
          id: 'condition-diagnosed-in-service',
          label: 'Was the condition diagnosed in service?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'current-diagnosis',
          label:
            'Do you have a current diagnosis or doctor that would sign a nexus letter for the condition?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'condition-severity',
          label:
            'Please describe the symptoms you have related to this condition. Include as much detail as you’re comfortable with.',
          component: 'text-area',
        },
        {
          id: 'condition-impact',
          label: 'Please explain how these symptoms impact your daily life. You can talk about work, daily activities, or social interactions.',
          component: 'text-area',
        },
        {
          id: 'condition-duration',
          label: 'When did you first notice the symptoms of this condition?',
          component: 'text-area',
        },
        {
          id: 'condition-start',
          label: 'How did this condition start?',
          component: 'text-area',
        },
        {
          id: 'condition-secondaries',
          label: 'Has this condition caused any other health problems for you? If so, please explain.',
          component: 'text-area',
          required: false,
        },
        {
          id: 'condition-frequency',
          label: 'How often do you experience symptoms of this condition?',
          component: 'text-area',
        },               
      ],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'mental-onset',
          label: 'When did you first start experiencing symptoms of a mental health condition?',
          component: 'radio',
          options: [
            'During military service',
            'After military service',
            'Other'
          ],
        },
        {
          id: 'mental-onset-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'mental-diagnosis',
          label: 'Have you been diagnosed with a mental health condition by a healthcare professional?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-diagnosis-details',
          label: 'If yes, please specify the diagnosis (Examples: Depression, Anxiety Disorder, etc.):',
          component: 'text-area',
          required: false,
        },
        {
          id: 'mental-symptoms',
          label: 'Which of the following symptoms do you experience? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Persistent sadness or emptiness',
            'Feelings of hopelessness or pessimism',
            'Irritability or anger',
            'Feelings of guilt or worthlessness',
            'Loss of interest in activities once enjoyed',
            'Excessive worry or fear',
            'Restlessness or feeling on edge',
            'Panic attacks',
            'Difficulty concentrating or making decisions',
            'Memory problems',
            'Trouble falling or staying asleep',
            'Sleeping too much',
            'Nightmares or disturbing dreams',
            'Social withdrawal or isolation',
            'Loss of motivation',
            'Changes in appetite or weight',
            'Hearing or seeing things that others do not',
            'Paranoid thoughts or mistrust of others',
            'Repetitive, unwanted thoughts',
            'Obsessive thinking',
            'Difficulty controlling worry',
            'Other'
          ],
        },
        {
          id: 'mental-symptoms-other',
          label: 'Describe any other symptoms you experience:',
          component: 'text-area',          
          required: false,
        },
        {
          id: 'mental-frequency',
          label: 'How often do you experience these symptoms?',
          component: 'radio',
          options: [
            'Daily',
            'Several times a week',
            'About once a week',
            'A few times a month',
            'Once a month or less'
          ],
        },
        {
          id: 'mental-work-impact',
          label: 'Explain how your mental health condition has negatively impacted your work life and career:',
          component: 'text-area',
        },
        {
          id: 'mental-self-harm',
          label: 'Have you ever had thoughts of self-harm or suicide?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-self-harm-help',
          label: 'Have you sought help or informed a healthcare professional?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-behaviors',
          label: 'Have you experienced any of the following behaviors? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Excessive spending',
            'Dangerous driving',
            'Substance abuse',
            'Physical altercations',
            'Verbal outbursts',
            'Excessive cleaning',
            'Repetitive checking',
            'Hoarding items',
            'Other'
          ],
        },
        {
          id: 'mental-behaviors-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'mental-relationship-impact',
          label: 'Explain how your mental health condition has negatively impacted your relationships and social interactions:',
          component: 'text-area',
        },
        {
          id: 'mental-disorientation',
          label: 'Have you experienced disorientation or confusion? (Examples: Getting lost in familiar places, confusion about the date or time',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-disorientation-details',
          label: 'Please provide details:',
          component: 'text-area',
        },
        {
          id: 'mental-daily-tasks',
          label: 'Do you have trouble managing daily tasks or personal care? (Examples: Neglecting household chores, forgetting to bathe or change clothes)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-daily-tasks-details',
          label: 'If yes, please explain:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'mental-legal-issues',
          label: 'Have you had any legal or disciplinary issues related to your condition? (Example: Arrested for disorderly conduct during a manic episode)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-legal-issues-details',
          label: 'If yes, please provide a brief explanation:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'mental-treatment',
          label: 'Are you currently receiving treatment for your mental health condition?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-treatment-types',
          label: 'If yes, please specify the type of treatment: (Select all that apply)',
          component: 'multi-select',
          options: [
            'Medication',
            'Therapy or counseling',
            'Group therapy',
            'Other'
          ],
          required: false,
        },
        {
          id: 'mental-treatment-helping',
          label: 'Is the treatment helping? (Example: Medication has reduced the frequency of panic attacks)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-treatment-details',
          label: 'Please explain:',
          component: 'text-area',
        },
        {
          id: 'mental-hospitalization',
          label: 'Have you ever been hospitalized for mental health reasons?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-hospitalization-details',
          label: 'If yes, please provide details such as date(s) and reason for hospitalization:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'mental-substance-use',
          label: 'Do you use substances like alcohol or drugs to cope with your symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-substance-types',
          label: 'Type of substances used:',
          component: 'multi-select',
          options: [
            'Alcohol',
            'Prescription medications (not as directed)',
            'Illegal drugs',
            'Other'
          ],
        },
        {
          id: 'mental-substance-frequency',
          label: 'Frequency of use:',
          component: 'radio',
          options: [
            'Daily',
            'Weekly',
            'Occasionally'
          ],
        },
        {
          id: 'mental-financial-impact',
          label: 'Do your symptoms impact you financially? (Examples: Loss of income, medical expenses, caregiver impact)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-financial-details',
          label: 'Please provide details about financial impact:',
          component: 'text-area',
        },
        {
          id: 'mental-assistance-needed',
          label: 'Do you require assistance with managing your finances or legal matters? (Example: A family member handles bill payments due to difficulty concentrating.)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-assistance-details',
          label: 'If yes, please explain:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'mental-sleep-issues',
          label: 'Have your symptoms affected your sleep patterns?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-sleep-types',
          label: 'If yes, please select all that apply:',
          component: 'multi-select',
          options: [
            'Difficulty Falling Asleep',
            'Difficulty Staying Asleep',
            'Sleeping Too Much',
            'Nightmares or Night Terrors'
          ],
          required: false,
        },
        {
          id: 'mental-emotional-control',
          label: 'Do you have difficulty controlling your emotions or reactions? (Examples: Outbursts of anger over small matters. Uncontrollable crying.)',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'mental-emotional-details',
          label: 'Please provide details:',
          component: 'text-area',
        },
        {
          id: 'mental-additional-info',
          label: 'Is there any additional information about your mental health condition you\'d like to share?',
          component: 'text-area',
        }
      ],
      categories: ['Mental'],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'ptsd-diagnosis',
          label: 'Have you been diagnosed with PTSD by a doctor or mental health professional?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ptsd-diagnosis-details',
          label: 'If yes, please provide the name of the professional and the date of diagnosis:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-service-related',
          label: 'Did any events during your military service contribute to your PTSD?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ptsd-service-details',
          label: 'If yes, you can briefly describe the event(s) if you\'re comfortable:',
          component: 'text-area',
          required: false,
        },
        // Section 2: Memory and Thought Processes
        {
          id: 'ptsd-memory-trouble',
          label: 'Do you have trouble remembering important things? (Examples: Forgetting names of close friends or family, important appointments, or personal information)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-memory-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-confusion',
          label: 'Have you ever felt confused about where you are or what time it is? (Examples: Finding yourself in a familiar place but not recognizing it, or not knowing the current date or year)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-confusion-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Communication and Speech
        {
          id: 'ptsd-speech-difficulty',
          label: 'Do you have difficulty speaking clearly or expressing your thoughts? (Examples: Slurred speech, losing your train of thought, or others having trouble understanding you)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-speech-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Behavior and Safety
        {
          id: 'ptsd-inappropriate-behavior',
          label: 'Have you ever acted in ways that are inappropriate in social settings? (Examples: Saying things that are out of place, acting impulsively without considering consequences)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-inappropriate-behavior-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-harm-thoughts',
          label: 'Do you ever feel like you might hurt yourself or others? (Examples: Thoughts of self-harm, aggressive urges toward others)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-harm-thoughts-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Daily Living Activities
        {
          id: 'ptsd-daily-tasks',
          label: 'Do you have trouble performing daily tasks like bathing, dressing, or managing finances? (Examples: Needing reminders to shower, difficulty choosing appropriate clothing, forgetting to pay bills)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-daily-tasks-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-bodily-control',
          label: 'Have you experienced loss of control over bodily functions? (Examples: Incontinence, difficulty controlling bladder or bowels)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-bodily-control-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Perception and Reality
        {
          id: 'ptsd-hallucinations',
          label: 'Do you see or hear things that others don\'t? (Examples: Hearing voices when alone, seeing figures or shadows that aren\'t there)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-hallucinations-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-strange-beliefs',
          label: 'Do you have beliefs that others find strange or can\'t understand? (Examples: Feeling that the TV is sending you messages, strong beliefs in conspiracies affecting you personally)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-strange-beliefs-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Orientation and Awareness
        {
          id: 'ptsd-disorientation',
          label: 'Have you ever found yourself somewhere and not remembered how you got there? (Examples: Driving and realizing you don\'t recall the past few miles, ending up in a room without remembering why)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-disorientation-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Mood and Emotional State
        {
          id: 'ptsd-mood-swings',
          label: 'Do you experience severe mood swings or emotional outbursts? (Examples: Sudden anger, intense sadness without clear reason, uncontrollable laughing or crying)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-mood-swings-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-emotional-numbness',
          label: 'Do you feel emotionally numb or disconnected from others? (Examples: Difficulty feeling love or happiness, feeling detached in relationships)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-emotional-numbness-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Anxiety and Stress Reactions
        {
          id: 'ptsd-hypervigilance',
          label: 'Do you feel on edge or easily startled? (Examples: Jumping at loud noises, feeling like you need to be on guard all the time)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-hypervigilance-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-panic-attacks',
          label: 'Do you have panic attacks? (Examples: Sudden episodes of intense fear with physical symptoms like heart palpitations, sweating, or shortness of breath)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-panic-frequency',
          label: 'If yes, how often do they occur?',
          component: 'text-area',
          required: false,
        },
        // Sleep and Concentration
        {
          id: 'ptsd-sleep-issues',
          label: 'Do you have trouble sleeping or nightmares? (Examples: Difficulty falling or staying asleep, disturbing dreams related to past events)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-sleep-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-concentration',
          label: 'Do you find it hard to concentrate or focus on tasks? (Examples: Losing track of conversations, difficulty completing tasks or following instructions)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-concentration-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        // Social and Occupational Impact
        {
          id: 'ptsd-social-withdrawal',
          label: 'Have you withdrawn from friends or family? (Examples: Avoiding social gatherings, feeling isolated, lack of interest in hobbies you once enjoyed)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-social-withdrawal-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ptsd-work-impact',
          label: 'Has PTSD affected your ability to work or hold a job? (Examples: Difficulty performing job duties, conflicts with coworkers, missing work due to symptoms)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-work-impact-details',
          label: 'Please describe how PTSD has impacted your work life:',
          component: 'text-area',
        },
        // Risky Behaviors
        {
          id: 'ptsd-risky-behavior',
          label: 'Have you engaged in reckless or self-destructive behavior? (Examples: Excessive drinking, drug use, unsafe driving, unprotected sex)',
          component: 'radio',
          options: ['Never', 'Sometimes', 'Often', 'Always'],
        },
        {
          id: 'ptsd-risky-behavior-comments',
          label: 'Comments or Examples:',
          component: 'text-area',
          required: false,
        }     
      ],
      categories: ['PTSD'],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'ankle-affected-side',
          label: 'Which ankle is affected?',
          component: 'radio',
          options: ['Left', 'Right', 'Both'],
        },
        {
          id: 'ankle-condition-origin',
          label: 'How did your ankle condition begin?',
          component: 'radio',
          options: [
            'Injury during military service',
            'Repetitive strain or overuse during military service',
            'Injury after military service',
            'Repetitive strain or overuse after military service',
            'Other'
          ],
        },
        {
          id: 'ankle-condition-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'ankle-pain',
          label: 'Do you experience pain in your ankle?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-pain-walking',
          label: 'Does your ankle pain make it difficult to walk or stand?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-movement',
          label: 'Do you have trouble moving your ankle up or down?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-stability',
          label: 'Does your ankle feel weak or unstable?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-supports',
          label: 'Do you use any supports or devices to help you walk?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-supports-details',
          label: 'If yes, what do you use? (e.g., brace, cane)',
          component: 'text-area',
          required: false,
        },
        {
          id: 'ankle-impact-activities',
          label: 'Has your ankle condition affected your ability to work or do daily activities?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'ankle-impact-details',
          label: 'If yes, can you provide a brief explanation?',
          component: 'text-area',
          required: false,
        }
      ],
      categories: ['Ankle'],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'headache-onset',
          label: 'When did your headaches begin?',
          component: 'radio',
          options: [
            'During military service',
            'After military service',
            'Other'
          ],
        },
        {
          id: 'headache-onset-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'headache-frequency',
          label: 'How often do you experience headaches?',
          component: 'radio',
          options: [
            'Daily',
            'Several times a week',
            'About once a week',
            'A few times a month',
            'Once a month or less'
          ],
        },
        {
          id: 'headache-duration',
          label: 'How long has your longest headache lasted?',
          component: 'radio',
          options: [
            'Less than 30 minutes',
            'Upwards of 30 minutes',
            'Upwards of 2 hours',
            'Upwards of 4 hours',
            'Upwards of 12 hours',
            'Upwards of 24 hours',
            'Other'
          ],
        },
        {
          id: 'headache-duration-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'headache-types',
          label: 'What type of headaches do you experience? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Tension Headaches (Dull, aching head pain; sensation of tightness or pressure)',
            'Migraines (Throbbing or pulsating pain, often with nausea and sensitivity)',
            'Cluster Headaches (Severe pain on one side, often around the eye)',
            'Other'
          ],
        },
        {
          id: 'headache-types-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'headache-symptoms',
          label: 'During a headache, do you experience any of the following symptoms? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Dull, aching head pain',
            'Throbbing or pulsating head pain',
            'Sharp or stabbing pain',
            'Nausea or vomiting',
            'Dizziness or lightheadedness',
            'Sensitivity to light',
            'Sensitivity to sound',
            'Sensitivity to smells',
            'Seeing spots or flashing lights',
            'Blurred vision',
            'Neck or shoulder pain',
            'Scalp tenderness',
            'Difficulty concentrating',
            'Irritability',
            'Aura (sensory disturbances before the headache)'
          ],
        },
        {
          id: 'headache-symptoms-description',
          label: 'Please describe any other symptoms:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-miss-work',
          label: 'Do your headaches cause you to miss work or other activities?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-miss-work-frequency',
          label: 'If yes, how often?',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-rest-required',
          label: 'Do your headaches require you to lie down or rest?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-medical-treatment',
          label: 'Have you sought medical treatment for your headaches?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-medications',
          label: 'If yes, are you currently on any medications for your headaches?',
          component: 'radio',
          options: ['Yes', 'No'],
          required: false,
        },
        {
          id: 'headache-medications-list',
          label: 'If yes, please list them if you can:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-specialist',
          label: 'Have you seen a specialist (e.g., neurologist)?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-triggers',
          label: 'What triggers your headaches? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Stress or anxiety',
            'Muscle tension',
            'Certain foods or drinks',
            'Lack of sleep or changes in sleep patterns',
            'Bright lights or glare',
            'Loud noises',
            'Strong smells',
            'Weather changes',
            'Physical exertion',
            'Skipping meals',
            'Hormonal changes',
            'Other'
          ],
        },
        {
          id: 'headache-triggers-description',
          label: 'Please describe other triggers:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-daily-impact',
          label: 'Do your headaches impact your daily life?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-daily-impact-description',
          label: 'If yes, can you provide a brief explanation?',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-financial-impact',
          label: 'Do your headaches impact you financially?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-financial-impact-description',
          label: 'Please provide details about financial impact:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-er-visits',
          label: 'Have you had Emergency Room visits due to headaches?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-er-frequency',
          label: 'If yes, how many times in the past year?',
          component: 'number',
          required: false,
        },
        {
          id: 'headache-hospitalizations',
          label: 'Have you been hospitalized due to headaches?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-hospitalizations-details',
          label: 'If yes, please provide details:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-preventive-therapies',
          label: 'Do you use preventive therapies for your headaches?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-relationship-impact',
          label: 'Have your headaches affected your relationships with family or friends?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'headache-relationship-impact-description',
          label: 'If yes, please explain:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'headache-additional-info',
          label: 'Do you have any additional information about your headaches that you\'d like to share?',
          component: 'text-area',
          required: false,
        }
      ],
      categories: ['Migraines'],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'chronic-fatigue-syndrome-onset',
          label: 'When did you first start experiencing symptoms of Chronic Fatigue Syndrome (CFS)?',
          component: 'radio',
          options: [
            'During military service (Example: Began feeling unexplained, persistent fatigue during deployment.)',
            'After military service (Example: Started experiencing severe tiredness a few years after discharge.)',
            'Other'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-onset-description',
          label: 'Please describe:',
          component: 'text-area',
        },
        {
          id: 'chronic-fatigue-syndrome-diagnosis',
          label: 'Have you been diagnosed with Chronic Fatigue Syndrome by a healthcare professional?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-diagnosis-date',
          label: 'If yes, when were you diagnosed? (Approximate date or year)',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-symptoms',
          label: 'Which of the following symptoms do you experience? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Unexplained fatigue lasting six months or longer',
            'Fatigue not substantially alleviated by rest',
            'Fatigue that is not due to ongoing exertion',
            'Problems with memory',
            'Difficulty concentrating',
            '"Brain fog" or mental cloudiness',
            'Unrefreshing sleep',
            'Insomnia',
            'Sleep apnea',
            'Muscle pain',
            'Joint pain without swelling or redness',
            'Headaches of a new type, pattern, or severity',
            'Sore throat',
            'Tender lymph nodes',
            'Post-exertional malaise (extreme exhaustion after physical or mental activity)',
            'Dizziness or lightheadedness',
            'Sensitivity to light or noise',
            'Digestive issues',
            'Other'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-symptoms-other',
          label: 'Please specify any other symptoms:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-frequency',
          label: 'How often do you experience these symptoms?',
          component: 'radio',
          options: [
            'Daily',
            'Several times a week',
            'About once a week',
            'A few times a month',
            'Once a month or less'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-work-impact',
          label: 'Explain how Chronic Fatigue Syndrome has negatively impacted your work life and career:',
          component: 'text-area',
          placeholder: 'Examples: Unable to maintain full-time employment, frequent absences, difficulty performing job duties'
        },
        {
          id: 'chronic-fatigue-syndrome-daily-impact',
          label: 'Explain how Chronic Fatigue Syndrome has negatively impacted your daily activities and personal life:',
          component: 'text-area',
          placeholder: 'Examples: Unable to perform household chores, difficulty caring for family, reduced social activities, etc.'
        },
        {
          id: 'chronic-fatigue-syndrome-post-exertion',
          label: 'Describe any instances where physical or mental exertion significantly worsened your symptoms:',
          component: 'text-area',
          placeholder: 'Examples: Extreme exhaustion after mild exercise, worsening symptoms after social events, etc.'
        },
        {
          id: 'chronic-fatigue-syndrome-cognitive',
          label: 'Have you experienced cognitive difficulties that interfere with your daily functioning?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-cognitive-details',
          label: 'If yes, please explain:',
          component: 'text-area',
          placeholder: 'Examples: Forgetting appointments, difficulty concentrating, trouble finding words, etc.',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-activity-modifications',
          label: 'Have you had to modify your activities to manage your symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-modifications-details',
          label: 'If yes, please describe:',
          component: 'text-area',
          placeholder: 'Examples: Breaking tasks into smaller steps, avoiding physical exertion, using assistive devices, etc.',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-treatment',
          label: 'Are you currently receiving treatment for Chronic Fatigue Syndrome?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-treatment-types',
          label: 'Type of Treatment: (Select all that apply)',
          component: 'multi-select',
          options: [
            'Medication',
            'Therapy or counseling',
            'Physical therapy',
            'Alternative therapies (e.g., acupuncture, massage)',
            'Other'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-treatment-helping',
          label: 'Is the treatment helping?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-treatment-details',
          label: 'Please explain:',
          component: 'text-area',
        },
        {
          id: 'chronic-fatigue-syndrome-related-conditions',
          label: 'Have you experienced any of the following due to Chronic Fatigue Syndrome? (Select all that apply)',
          component: 'multi-select',
          options: [
            'Depression or anxiety',
            'Sleep disorders',
            'Frequent infections',
            'Allergies or sensitivities',
            'Fibromyalgia',
            'Irritable bowel syndrome',
            'Orthostatic intolerance',
            'Other'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-conditions-details',
          label: 'Please provide details for any checked items:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-financial-impact',
          label: 'Do your symptoms impact you financially?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-financial-details',
          label: 'Please provide details about financial impact:',
          component: 'text-area',
          required: false,
          placeholder: 'Examples: Loss of income, medical expenses, additional costs for assistance, etc.'
        },
        {
          id: 'chronic-fatigue-syndrome-assistance',
          label: 'Do you require assistance with daily activities due to your symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-assistance-details',
          label: 'If yes, please explain:',
          component: 'text-area',
          placeholder: 'Examples: Help with cooking, cleaning, shopping, personal care, etc.',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-relationships',
          label: 'Have your symptoms affected your relationships with family or friends?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-relationships-details',
          label: 'If yes, please explain:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-hospitalization',
          label: 'Have you ever been hospitalized due to Chronic Fatigue Syndrome or related symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-hospitalization-details',
          label: 'If yes, please provide details:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-legal',
          label: 'Do you have any legal or employment disputes related to your condition?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-legal-details',
          label: 'If yes, please provide a brief explanation:',
          component: 'text-area',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-substance-use',
          label: 'Do you use substances like alcohol or drugs to cope with your symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-substance-types',
          label: 'Type of substances used:',
          component: 'multi-select',
          options: [
            'Alcohol',
            'Prescription medications (not as directed)',
            'Illegal drugs',
            'Other'
          ],
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-substance-frequency',
          label: 'Frequency of use:',
          component: 'radio',
          options: [
            'Daily',
            'Weekly',
            'Occasionally'
          ],
        },
        {
          id: 'chronic-fatigue-syndrome-lifestyle',
          label: 'Have you implemented any lifestyle changes to manage your symptoms?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-lifestyle-details',
          label: 'If yes, please describe:',
          component: 'text-area',
          placeholder: 'Examples: Dietary changes, sleep schedule adjustments, stress management techniques, etc.',          
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-sleep',
          label: 'Do you experience any sleep disturbances not previously mentioned?',
          component: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'chronic-fatigue-syndrome-sleep-details',
          label: 'If yes, please describe:',
          component: 'text-area',
          placeholder: 'Examples: Frequent waking, vivid dreams or nightmares, etc.',
          required: false,
        },
        {
          id: 'chronic-fatigue-syndrome-additional',
          label: 'Is there any additional information about your Chronic Fatigue Syndrome you\'d like to share?',
          component: 'text-area',
          required: false,
        }
      ],
      categories: ['Chronic Fatigue Syndrome'],
      conditional: {
        field: 'intent-to-file',
        value: 'Yes',
      },
    },
  ]