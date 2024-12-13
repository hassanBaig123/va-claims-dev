import { createClient } from '@/utils/supabase/server'
import { randomUUID } from 'crypto';
import { id } from 'date-fns/locale';
import { create } from 'domain';
import kafka, { ProduceRequest } from 'kafka-node'
import { Expand } from 'lucide-react';
import { NextRequest, NextResponse } from 'next/server'

// Split the context types into regular and decrypted tables
type RegularTableType = 'users' | 'forms' | 'node_templates';
type DecryptedTableType = 'decrypted_forms';

interface Context {
  type: RegularTableType | DecryptedTableType;
  object_id: string;
}

interface TaskRequest {
  topics: any;
  node_template_name: string;
  selectedTaskGroups: string[];
  selectedTasks: string[];
  selectedConditions: string[];
  session_id: string;
  user_id: string;
  task?: {
    description: string;
    input_description?: string;
    action_summary?: string;
    outcome_description?: string;
    feedback?: string;
    output?: string;
  };
  contexts: Context[];
  context_info?: any;
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log('POST /api/task - Request received');

  const supabase = await createClient()
  console.log('Supabase client created');

  let body: TaskRequest;
  try {
    body = await req.json() as TaskRequest;
    console.log('Request body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
  }

  // Now TypeScript knows the exact shape of body
  // You get autocomplete and type checking for all properties
  if (!body.node_template_name) {
    console.error('Missing node_template_name in request body');
    return NextResponse.json({ error: 'Missing node_template_name in request body' }, { status: 400 })
  }

  if (!body.selectedTaskGroups || !Array.isArray(body.selectedTaskGroups) || body.selectedTaskGroups.length === 0) {
    console.error('Missing or invalid selectedTaskGroups in request body');
    return NextResponse.json({ error: 'Missing or invalid selectedTaskGroups' }, { status: 400 })
  }

  // Generate a session ID if one isn't provided
  // Use consistent session ID for all tasks in group
  let groupSessionId;
  
  if (!body.session_id) {
    groupSessionId = randomUUID();
  } else {
    groupSessionId = body.session_id;
  }

  if (!body.task || !body.task.description) {
    console.error('Missing task description in request body');
    return NextResponse.json({ error: 'Missing task description in request body' }, { status: 400 })
  }

  // Also check for contexts if they are required
  if (!body.contexts || !Array.isArray(body.contexts) || body.contexts.length === 0) {
    console.error('Missing or invalid contexts in request body');
    return NextResponse.json({ error: 'Missing or invalid contexts' }, { status: 400 })
  }
  
  console.log('Validating contexts');
  //for (const context of body.contexts) {
  //  console.log(`Fetching data for context type: ${context.type}, id: ${context.object_id}`);
  //  
  //  // Split validation based on table type
  //  if (context.type === 'decrypted_forms') {
  //    const { data: objectData, error: objectError } = await supabase
  //      .from('decrypted_forms')
  //      .select('*')
  //      .eq('id', context.object_id)
  //      .single();
  //
  //    if (objectError) {
  //      console.error(`Error fetching ${context.type} data:`, objectError);
  //      return NextResponse.json({ error: `Failed to fetch ${context.type} data` }, { status: 500 });
  //    }
  //
  //    if (!objectData) {
  //      console.error(`${context.type} not found for id: ${context.object_id}`);
  //      return NextResponse.json({ error: `${context.type} not found` }, { status: 404 });
  //    }
  //  } else {
  //    // Handle regular tables
  //    const { data: objectData, error: objectError } = await supabase
  //      .from(context.type as RegularTableType)
  //      .select('*')
  //      .eq('id', context.object_id)
  //      .single();
  //
  //    if (objectError) {
  //      console.error(`Error fetching ${context.type} data:`, objectError);
  //      return NextResponse.json({ error: `Failed to fetch ${context.type} data` }, { status: 500 });
  //    }
  //
  //    if (!objectData) {
  //      console.error(`${context.type} not found for id: ${context.object_id}`);
  //      return NextResponse.json({ error: `${context.type} not found` }, { status: 404 });
  //    }
  //  }
  //  console.log(`Data fetched successfully for ${context.type}`);
  //}

  // Fetch the node template
  console.log(`Fetching node template with name: ${body.node_template_name}`);
  const { data: nodeTemplate, error: templateError } = await supabase
    .from('node_templates')
    .select('*')
    .eq('name', body.node_template_name)
    .single() as { data: any | null, error: any };

  if (templateError) {
    console.error('Error fetching node template:', templateError);
    return NextResponse.json({ error: 'Failed to fetch node template' }, { status: 500 })
  }

  if (!nodeTemplate) {
    console.error(`Node template not found for name: ${body.node_template_name}`);
    return NextResponse.json({ error: 'Node template not found' }, { status: 404 })
  }

  console.log('Node template fetched successfully:', nodeTemplate);

  // Create Kafka client and producer
  console.log('Creating Kafka client and producer');
  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BROKER_URL,
  })
  const producer = new kafka.Producer(client)

  const topic = 'agency_action'
  console.log(`Kafka topic: ${topic}`);

  // We need to attach the user context by looking for any contexts that are of type 'users'
  console.log('Processing user context');
  const userContext = body.contexts.find((context: { type: string }) => context.type === 'users')?.object_id;
  console.log('User context:', userContext);



  // We need to attach the object contexts by looking for any contexts that are of type 'forms'
  console.log('Processing object contexts');
  const objectContexts = body.contexts.filter((context: { type: string }) => context.type === 'forms').map((context: { object_id: string, type: string }) => {
    return {
      object_id: context.object_id,
      type: context.type
    }
  })
  console.log('Object contexts:', objectContexts);

  const id = randomUUID();
  const reportStructure = {
    user_id: "5678",
    executive_summary: "This is a detailed executive summary of the report.",
    condition_sections: [
      {
        condition: "Hypertension",
        scoring: {
          score: "3",
          summary: "The patient has moderate hypertension."
        },
        summary: "The patient has been experiencing high blood pressure for the past 5 years.",
        research: [
          {
            url: "http://medicaljournal.com/hypertension-study",
            summary: "A comprehensive study on the effects of hypertension.",
            published_date: "2022-05-15",
            author: "Dr. Jane Smith",
            title: "Hypertension and Its Long-term Effects"
          }
        ],
        nexus_letter: {
          letter: "This letter confirms the diagnosis of hypertension.",
          research: [
            {
              url: "http://medicaljournal.com/hypertension-study",
              summary: "A comprehensive study on the effects of hypertension.",
              published_date: "2022-05-15",
              author: "Dr. Jane Smith",
              title: "Hypertension and Its Long-term Effects"
            }
          ]
        },
        personal_statement: "I have been dealing with high blood pressure for several years, which has affected my daily life.",
        keypoints: ["Documenting daily blood pressure readings", "Providing evidence of lifestyle changes to manage hypertension", "Highlighting the impact of hypertension on daily activities and work", "Gathering statements from family or friends about the condition's effects"],
        c_and_p_tips: ["Keep a record of your symptoms", "Bring all relevant medical documents", "Be honest and detailed about your condition"]
      }
    ]
  };

  const createTaskGroup = (groupName: string, tasks: any[], parentId: string, groupSessionId: string, contextInfo: any) => ({
    key: `task_group:${parentId}:${groupName.toLowerCase().replace(/\s+/g, '_')}`,
    name: groupName, 
    description: `Task group for ${groupName}`,
    session_id: groupSessionId,
    context_info: contextInfo,
    tasks: tasks
  });


  
  // Create task groups for story writing workflow
  const storyTaskGroups = [
    createTaskGroup("Research Story", [
      {
        name: "Find Story URLs",
        agent_class: "ResearchAgent",
        shared_instructions: `
        Please read your MANUAL.md using the FileSearch tool first to understand your capabilities and best practices.`,
        message_template: `Your task is to find at least 3 relevant article URLs from vaclaimsinsider.com blogs on this topic using the FileSearch tool:
        {topics}
        
        Steps:
        1. Use the SearchTool tool to find the URLs
        2. Use ReadPageText to validate each URL before saving it
        3. If the text is relevant, save the URL and save the content and retrieve the content_id from the ReadPageText tool.
        4. Skip any URLs that return 404 or other errors
        5. After saving the content for 3 urls, run the SaveStoryURLs tool to save the URLs and content_ids.

        We do not want to store any content that is not relevant to the topic or is a sales related article or lead magnet. We only want to store information that is directly related to the topic and is educational or informative in nature and designed to help the veteran understand their the va claims process and how to navigate the VA claims process.

        Remember to validate each URL with ReadPageText before saving it. Set the save=true parameter in the ReadPageText tool if the content is relevant.`,
        result_keys: ["story_urls"],
        tools: ["SearchTool", "SaveStoryURLs"],
        dependencies: ["topics"]
      },
      {
        name: "Process Story Content",
        agent_class: "SpecializedBrowsingAgent",
        shared_instructions: `
        Please read your MANUAL.md using the FileSearch tool first to understand your capabilities and best practices.`,
        message_template: `Process the content from this story:
        Content ID: {content_id}

        Process the chunks of content from the provided content_id using the SaveToStoryResearch tool and save research_items for the chunks until you have processed the entire article with content_id: {content_id}
        
        1. Use SaveToStoryResearch to process the saved content.
        2. Continue to process the next chunk of content until you have processed the entire article.
        3. If you are unable to find the content for the content_id, then you can abandon the content_id and move on to the next content_id.

        Provide research_items for each chunk of content to continue processing. Utilize the context property to save any additional information that you need to save about the article.`,
        result_keys: ["story_research"],
        tools: ["SaveToStoryResearch"],
        dependencies: ["story_urls"],
        expansion_config: {
          array_mapping: {
            "story_url": "story_urls"
          },
          identifiers: {
            'content_id': 'story_url.content_id'
          },
          type: 'array',
          process_array_output: true,
        }
      }], id, body.session_id, body.context_info),
      createTaskGroup("Write Story", [{
        name: "Write Story",
        agent_class: "StoryWriter",
        shared_instructions: "Write a final article explaining the findings of the research and analysis.",
        message_template: `Instructions:
        1. Review the VA Claims Blogs Guide.pdf file with the FileSearch tool to understand the structure and format of the article to be inserted into our Strapi content api.
        2. Use the SaveToStory tool to save the final article.
        
        Research for Content Id: {content_id} -
        {story_research}

        Write an explainatory article incorporating the research findings and analysis insights above:
        - Research findings
        - Analysis insights
        - Clear narrative structure
        
        Output the final article as markdown.`,
        result_keys: ["story"],
        tools: ["SaveToStory"],
        dependencies: ["story_research"],
        expansion_config: {
          type: 'array',
          identifiers: {
            'content_id': 'research.content_id',
            'research_items': 'research.research_items'
          },
          array_mapping: {
            "research": "story_research"
          },
          output_format: 'merge'
        }
      }], id, body.session_id, body.context_info)
    ];


    // First determine if this is a story writing task
    const isStoryWritingTask = body.selectedTasks.some(task => 
      storyTaskGroups.some(storyGroup => 
        storyGroup.tasks.some(storyTask => storyTask.name === task)
      )
    );

    // Initialize serializedConditions
    let serializedConditions: Array<{ condition_name: string; description: string }> = [];

    // Only validate conditions for non-story writing tasks
    if (!isStoryWritingTask) {
      if (!body.selectedConditions || !Array.isArray(body.selectedConditions) || body.selectedConditions.length === 0) {
        console.error('Missing or invalid selectedConditions in request body');
        return NextResponse.json({ error: 'Missing or invalid selectedConditions' }, { status: 400 })
      }

      // Transform selected conditions into the required format
      serializedConditions = body.selectedConditions.map((conditionName: any) => ({
        condition_name: conditionName,
        description: `Condition: ${conditionName}`
      }));
    }

    // Keep all existing task group definitions but update their array_mapping
    const taskGroups = [
      createTaskGroup("Retrieve Information", [
        {
          name: "Retrieve Intake Information",
          agent_class: "ProcessIntakeAgent",
          shared_instructions: `Instructions:
          1. Use GetIntake tool to retrieve the intake form data for the given user_id: {user_id}.
             Example parameters for GetIntake:
             {
               "user_id": "{user_id}",
               "type": "intake"
             }
          2. Process the retrieved intake form data and organize it into a list of Question objects (with question and answer fields) and ConditionInfo objects (with condition_name and description fields).
          3. Use SaveIntakeInformation tool to save the processed intake information by passing the user_id, intake_info list, and conditions list. The tool will update the context with this information.`,
          message_template: "Retrieve and process the customer intake information for all conditions for user_id: {user_id}. You must run the SaveIntakeInformation tool to save the intake information.",
          result_keys: ["intake_info"],
          dependencies: ["user_id"],
          tools: []
        },
        {
          name: "Retrieve Supplemental Information",
          agent_class: "ProcessSupplementalAgent",
          shared_instructions: `Instructions:
          1. Use GetSupplementals tool to retrieve all supplemental forms data for the given user_id: {user_id}.
             Example parameters for GetIntake:
             {
               "user_id": "{user_id}"
             }
          2. Process the retrieved supplemental form data and organize it into a list of Question objects (with question and answer fields).
          3. Use AggregateIntakes tool to save the processed supplemental information by passing:
             - condition: The condition object from the expansion config
             - supplemental_info: The list of Question objects from step 2
             Example parameters for AggregateIntakes:
             {
               "condition": {
                 "condition_name": "Hypertension",
                 "description": "High blood pressure condition"
               },
               "supplemental_info": [
                 {
                   "question": "How long have you had this condition?",
                   "answer": "5 years"
                 }
               ]
             }
             The tool will aggregate the supplemental information for each condition.`,
          message_template: `Retrieve and process supplemental information for user_id: {user_id}.
          conditions: {conditions}

          You must run the AggregateIntakes tool to save the supplemental information. You will fail without using the AggregateIntakes tool.
          `,
          result_keys: ["supplemental_info"],
          tools: ["GetSupplementals", "AggregateIntakes"],
          dependencies: ["intake_info", "conditions", "user_id"],
        },
        {
          name: "Retrieve Notes Information",
          agent_class: "ProcessNotesAgent",
          shared_instructions: `Retrieve and process the customer notes information for user_id: {user_id}.
          After saving the information, utilize the CompileDocument tool to build the document from your updates.`,
          message_template: "Retrieve and process the customer notes information for user_id: {user_id}. You only need to run the GetNotes and SaveNotesInformation tools once.",
          result_keys: ["notes_information"],
          optional_result_keys: ["notes_information"],
          tools: ["GetNotes", "SaveNotesInformation"],
          dependencies: ["intake_info", "supplemental_info", "conditions", "user_id"],
        },
      ], id, body.session_id, body.context_info),
      createTaskGroup("Research", [
        {
          name: "Research 38CFR",
          agent_class: "Research38CFR",
          shared_instructions: `Research for 38 CFR Part 4 requirements for condition: {condition_name} and save the relevant information for the report for user_id: {user_id}.`,
          message_template: `Research for 38 CFR Part 4 requirements for condition: {condition_name}.
          - Intake Information: {intake_info}
          - Supplemental Info: {supplemental_info}
          - Notes Information: {notes_information}
          `,
          result_keys: ["cfr_38_requirements"],
          tools: ["SaveTo38CFRResearch"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
        },
        {
          name: "Research Section",
          agent_class: "BrowsingAgent",
          shared_instructions: `Research for condition: {condition_name} and save the relevant information for the report for user_id: {user_id}.`,
          message_template: `Create at least 3 research sections in markdown format using the SaveToResearchSection tool {condition_name} based on: 
          - Intake Information: {intake_info}
          - Supplemental Info: {supplemental_info}
          - Notes Information: {notes_information}
          - 38 CFR Research: {cfr_38_requirements}
          
          The research sections should include relevant information for the condition and specifically how it is plausible to be service-connected based on the information provided in the intake, supplemental, and notes information. It should be considered peer-reviewed and/or possibly scholarly in nature. It is important to have specific examples of how our customer's condition could be service-connected. You will continue to research and write until you have at least 3 research sections for {condition_name}.

          Do not include any in-text citations such as 【4:0†source】. Remove these from the output.
          
          You must run the SaveToResearchSection tool to save the research sections. You will fail without using the SaveToResearchSection tool.
          `,
          result_keys: ["research_sections"],
          tools: ["SaveToResearchSection"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "cfr_38_requirements", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name',
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'merge'
          }
        }], id, body.session_id, body.context_info),
        createTaskGroup("Evidence", [
        {
          name: "Personal Statement",
          agent_class: "PersonalStatementWriter",
          shared_instructions: `Write a personal statement in markdown format for a veteran seeking approval for a disability rating for {condition_name}. Read customer communication/email from the customer intake and supplemental information and notes to craft a personalized statement specifically for {condition_name}.

          Use the following formatting criteria: 
           Open the statement with 'Hello, I'm [Veteran's First Name] [Veteran's Last Name].' 
           End it with 'Thank you.'
           
           Tone and Style:
           Use the following tone and style criteria: Use straightforward language that feels like it is coming from an adult. 
           In tone of voice, aim for a midpoint between highly educated and poorly educated.
           Avoid any aspects that would make it seem written by ChatGPT. Write the statement in a way that is not flowery, but is not written in like a 3rd grader either, a good happy medium that seems naturally written by a layperson, and not like it was written by ChatGPT.
           
           Content:
           Focus on specific information for 1 single condition. Do not mention other claims other than for the condition the service member is writing the personal statement specifically for.
           Ensure all content in the statement aligns with the 38 CFR Part 4 but never mention the 38CFR.
           Prioritize information that will provide the most accurate rating for the veteran. 
           For any statements regarding mental health, have a dedicated paragraph focused on social impairment and another dedicated paragraph focused on occupational impairment.
           For any statements regarding combat-related PTSD, focus on the stressor events directly related to combat, war related training exercises, taking incoming fire, or witnessing others being injured or killed in combat and not directly mentioned non-combat related stressors i.e. carrying caskets of fallen soldiers, etc.
           Personal statements should only speak about one condition rather than speaking about multiple conditions. Meaning in the case where we have multiple conditions, we should write individual personal statements for each condition rather than one personal statement for all conditions. You use straightforward language that feels like it is coming from an adult and never sound like ChatGPT. You do not write Nexus Letters. Nexus Letters are written by the NexusLetterWriter.
           
           - Continue to draft, review, and write final drafts for each condition requested by the customer until all conditions have been written.
           
           Important Rules:
               Be sure to mention important details such as persumptive conditions.
               Do not include any in-text citations such as 【4:0†source】. Remove these from the output.
               
          Priority:
          Run the FileSearch tool first and find the section that is most relevent to the condition within the 38CFR and using this information, write the personal statement but without any jargon or language from the 38CFR, or even mentioning the 38CFR is prohibited.
          
          After saving the information, utilize the CompileDocument tool to build the document from your updates.`,
          message_template: `Using the following dependencies, craft a personal statement in markdown format using the SaveToPersonalStatements tool for user_id: {user_id} utilizing the following information:
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}

          You must utilize the SaveToPersonalStatements tool to save the personal statement. You will fail without using the SaveToPersonalStatements tool.
          `,
          result_keys: ["personal_statements"],
          tools: ["SaveToPersonalStatements"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'merge'
          }
        },
        {
          name: "Nexus Letter",
          agent_class: "NexusLetterWriter",
          shared_instructions: `Write a Nexus Letter in markdown format for {condition_name} that establishes service connection for user_id: {user_id}.

          Formatting Requirements:
          Use the following formatting criteria:
              1.) Research the Sample Nexus Letters that you've been provided within your files to ensure that you understand the format and the content that is required as examples only. 
              3.) Include up to 2 supporting scientific studies if applicable to support the connection between the condition and the veteran's service included within the text in citation format.
              4.) When referencing the condition's possible connection to the veterans service, utilize the phrase "at least as likely as not" to indicate the connection between the condition and the veteran's service.
              5.) Include the phrase "after a thorough review of his service treatment records and the Veterans Administration claims folder" to indicate that the connection is based on the evidence in the veterans file.
              6.) Utilize the following structure for the Nexus Letter:
              [Doctor's Letterhead] //Each should be on a new line.
              [Doctor's Name]
              [Doctor's Specialty]
              [Doctor's Address]
              [City, State, Zip]
              [Phone Number]
              [Email Address]
              [Date]
     
              Hello,
     
              [Action: Fully written and Complete Letter Body that includes supporting statements that include the 2 supporting scientific studies provided by the reseach sections in citation format.]
              
              Sincerely,
     
              [Doctor's Signature]
              [Doctor's Name]
              [License Number]
              [Specialty and Qualifications]
     
              [Space for Doctor's Signature]
     
              [References to the 2 supporting scientific studies in citation format from the research_sections.]
              
              Use the following tone and style criteria:
              Use straightforward language that feels like it is coming from a medical professional.
              Do not include any of the information from the examples in the Nexus Letter you are writing. 
              It should be written in a format that meets the requirements of the length and the content that is required for a Nexus Letter incorporating the information that you have been provided by the {intake_info}.
              Avoid any aspects that would make it seem written by ChatGPT.
              Do not include any of the information from the examples in the Nexus Letter you are writing. (e.g. sample-nexus-letter*.*)
              
              Do not label paragraphs with anything such as numbers or Social Impairment: or Occupational Impairment:.
              
              Content:
              Focus on specific information for 1 single condition unless otherwise requested.
              Do not mention other claims other than for the condition the service member is writing the NexusLetter specifically for.
              Ensure all content in the statement aligns with the 38 CFR Part 4 but never mention the 38CFR.
              Prioritize information that will provide the most accurate rating for the veteran.
              For any statements regarding back or neck conditions, include any information regarding nerve damage, radiculopathy, or any other symptoms that are related to the condition in the upper or lower extremities.
     
              Most importantly, the veteran's name has been excluded from the information provided to you so you will not be able to include the veteran's name in the Nexus Letter and you will replace the veteran's name with "[Service Member's Name]" within the NexusLetter.

              You must use the SaveToNexusLetters tool to save the Nexus Letter. You will fail without using the SaveToNexusLetters tool.
              Do not include any in-text citations such as 【4:0†source】. Remove these from the output.
              
              After saving the information, utilize the CompileDocument tool to build the document from your updates.`,
          message_template: `Using the following dependencies, craft a nexus letter in markdown format using the SaveToNexusLetters tool for user_id: {user_id}:
          - research_sections: {research_sections}
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}

          Do not add in-text citations such as 【4:0†source】. The output should only be text and not include any in-text citations.
          
          Priority:
          Run the FileSearch tool first and find the section that is most relevent to the condition within the 38CFR and using this information, write the personal statement but without any jargon or language from the 38CFR, or even mentioning the 38CFR is prohibited.`,
          result_keys: ["nexus_letters"],
          tools: ["SaveToNexusLetters"],
          dependencies: ["research_sections", "cfr_38_requirements","intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'merge'
          }
        }], id, body.session_id, body.context_info),
        createTaskGroup("Condition Section", [
        {
          name: "38 CFR Tips",
          agent_class: "ReportSectionWriter",
          shared_instructions: `Write C&P exam tips in markdown format using the SaveToPointsFor38CFR tool for {condition_name} based on 38 CFR requirements.
          
          The tips should:
          1. Address specific rating criteria from 38 CFR
          2. Include preparation guidance for the exam
          3. List important symptoms to document
          4. Suggest medical records to bring
          5. Provide communication tips
          
                  Instructions for simplifing the writing:

          Original Complex Sentence:
          "Understand that insomnia is rated under the 38 CFR based on the severity of symptoms and their impact on daily life. Ratings can range from mild to severe, affecting your ability to function socially and occupationally."
          Simplified Version:
          "It's important to know that the VA rates insomnia (trouble sleeping) based on how bad your symptoms are and how they affect your daily life. You might notice that these ratings can be low or high, depending on how insomnia makes it difficult for you to be around others or do your job."
          Explanation:
          Simple Language: Uses common words like "how bad your symptoms are" instead of "severity of symptoms," and "do your job" instead of "function occupationally."
          Short Sentences: Breaks the information into clear, manageable sentences.
          Professional Tone: Maintains an authoritative voice appropriate for expert communication.
          Technical Terms Explained: Provides a brief explanation of "insomnia" as "trouble sleeping."
          Empathetic Language: Starts with "It's important to know" and includes "You might notice," making the tone more personable.
          Retains Essential Details: Keeps all critical information so the reader feels informed and respected.
          Example 2
          Original Complex Sentence:
          "Prepare by keeping a sleep diary for a few weeks before the exam. Note the time you go to bed, how long it takes to fall asleep, any awakenings during the night, and how you feel in the morning. This will help provide a clear picture of your sleep patterns."
          Simplified Version:
          "You might consider keeping a sleep diary before your exam. Write down when you go to bed, how long it takes to fall asleep, if you wake up at night, and how you feel in the morning. This will help show your sleep patterns."
          Explanation:
          Simple Language: Uses "write down" instead of "note," making it more accessible.
          Short Sentences: Presents one idea per sentence for clarity.
          Empathetic Language: Begins with "You might consider," offering gentle guidance.
          Clear Action Steps: Provides straightforward instructions on what the reader can do next.
          Professional Tone: Maintains respect and expertise without being condescending.
          Retains Details: Includes all necessary information for preparing for the exam.
          Example 3
          Original Complex Sentence:
          "Insomnia can become a chronic issue if not addressed early. It may lead to increased fatigue, mood disturbances, and cognitive impairments. Over time, chronic insomnia can contribute to more severe health issues such as depression, anxiety, and cardiovascular problems."
          Simplified Version:
          "It's important to remember that if trouble sleeping isn't helped early, it can become a long-term problem. This might make you feel more tired, affect your mood, and make thinking harder. Over time, not sleeping well can lead to serious health issues like depression, anxiety, and heart problems."
          Explanation:
          Simple Language: Uses "trouble sleeping" instead of "insomnia" and "long-term problem" instead of "chronic issue."
          Empathetic Language: Starts with "It's important to remember," engaging the reader.
          Short Sentences: Breaks complex ideas into simpler statements.
          Professional Tone: Communicates expertise respectfully.
          Avoids Oversimplifying: Explains potential health issues without reducing them to simplistic terms.
          Retains Accuracy: Keeps all essential details about the progression and consequences of untreated insomnia.
          Example 4
          Original Complex Sentence:
          "Medical evaluations often include audiometric testing to assess the degree of hearing loss. Veterans may also experience related conditions such as tinnitus, which is a ringing in the ears."
          Simplified Version:
          "Doctors usually do hearing tests called audiometric tests to find out how much hearing loss you have. You might also have tinnitus, which means hearing ringing sounds in your ears."
          Explanation:
          Simple Language: Uses "hearing tests" and explains "audiometric tests."
          Technical Terms Explained: Provides definitions for "audiometric tests" and "tinnitus."
          Short Sentences: Enhances readability.
          Professional Tone: Maintains an authoritative voice.
          Empathetic Language: Uses "You might also have," acknowledging the reader's experience.
          Retains Essential Details: Includes key information about medical evaluations and related conditions.
          Example 5
          Original Complex Sentence:
          "Research indicates that combat deployment significantly increases the risk of new-onset hearing loss. Studies have highlighted the need for improved hearing protection and preventive strategies for military personnel."
          Simplified Version:
          "Studies show that going to combat can greatly increase the chance of hearing loss starting. It's important to know that better hearing protection is needed for people in the military to help prevent this."
          Explanation:
          Simple Language: Translates "combat deployment" to "going to combat" and "significantly increases the risk" to "greatly increase the chance."
          Empathetic Language: Begins with "It's important to know," making the tone more personable.
          Short Sentences: Separates ideas for better understanding.
          Professional Tone: Maintains respect and authority.
          Retains Accuracy: Keeps essential details about the findings and recommendations from research.
          Provides Clear Action Steps: Suggests the need for better hearing protection as a preventive measure.
          
          Lastly:
          - Please write to a 3rd-grade reading level, ensuring the language is simple, clear, and professional. Use short sentences and common words while maintaining an authoritative and respectful tone appropriate for expert communication. If technical terms are necessary, include a brief explanation in parentheses. Avoid sounding condescending; the goal is to make the information accessible without oversimplifying. Keep the content accurate and retain all essential details, so the reader feels informed and respected.
          Use Empathetic Language:
          Phrases like 'You might notice...' or 'It's important to remember...' can make the tone more personable.
          Provide Clear Action Steps:
          If applicable, offer straightforward guidance on what the reader can do next.

          Do not include any in-text citations.
          Do not provide any medical advice or treatment recommendations including any text that could be construed as medical advice or treatment recommendations.
          You must run the SaveToPointsFor38CFR tool to save the C&P exam tips. You will fail without using the SaveToPointsFor38CFR tool.`,
          message_template: `Using the following dependencies, create C&P exam tips in markdown format for {user_id}:
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}`,
          result_keys: ["cfr_tips"],
          tools: ["SaveToPointsFor38CFR"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'separate'
          }
        },
        {
          name: "Key Points",
          agent_class: "ReportSectionWriter",
          shared_instructions: `Write key points in markdown format using the SaveToKeyPoints tool summarizing important aspects of {condition_name} for user_id: {user_id}.
          The key points should:
          1. Highlight critical findings about the condition
          2. Summarize severity and progression
          3. Note important medical evidence
          4. Include relevant service connection details
          5. Reference supporting research
          
                  Instructions for simplifing the writing:

          Original Complex Sentence:
          "Understand that insomnia is rated under the 38 CFR based on the severity of symptoms and their impact on daily life. Ratings can range from mild to severe, affecting your ability to function socially and occupationally."
          Simplified Version:
          "It's important to know that the VA rates insomnia (trouble sleeping) based on how bad your symptoms are and how they affect your daily life. You might notice that these ratings can be low or high, depending on how insomnia makes it difficult for you to be around others or do your job."
          Explanation:
          Simple Language: Uses common words like "how bad your symptoms are" instead of "severity of symptoms," and "do your job" instead of "function occupationally."
          Short Sentences: Breaks the information into clear, manageable sentences.
          Professional Tone: Maintains an authoritative voice appropriate for expert communication.
          Technical Terms Explained: Provides a brief explanation of "insomnia" as "trouble sleeping."
          Empathetic Language: Starts with "It's important to know" and includes "You might notice," making the tone more personable.
          Retains Essential Details: Keeps all critical information so the reader feels informed and respected.
          Example 2
          Original Complex Sentence:
          "Prepare by keeping a sleep diary for a few weeks before the exam. Note the time you go to bed, how long it takes to fall asleep, any awakenings during the night, and how you feel in the morning. This will help provide a clear picture of your sleep patterns."
          Simplified Version:
          "You might consider keeping a sleep diary before your exam. Write down when you go to bed, how long it takes to fall asleep, if you wake up at night, and how you feel in the morning. This will help show your sleep patterns."
          Explanation:
          Simple Language: Uses "write down" instead of "note," making it more accessible.
          Short Sentences: Presents one idea per sentence for clarity.
          Empathetic Language: Begins with "You might consider," offering gentle guidance.
          Clear Action Steps: Provides straightforward instructions on what the reader can do next.
          Professional Tone: Maintains respect and expertise without being condescending.
          Retains Details: Includes all necessary information for preparing for the exam.
          Example 3
          Original Complex Sentence:
          "Insomnia can become a chronic issue if not addressed early. It may lead to increased fatigue, mood disturbances, and cognitive impairments. Over time, chronic insomnia can contribute to more severe health issues such as depression, anxiety, and cardiovascular problems."
          Simplified Version:
          "It's important to remember that if trouble sleeping isn't helped early, it can become a long-term problem. This might make you feel more tired, affect your mood, and make thinking harder. Over time, not sleeping well can lead to serious health issues like depression, anxiety, and heart problems."
          Explanation:
          Simple Language: Uses "trouble sleeping" instead of "insomnia" and "long-term problem" instead of "chronic issue."
          Empathetic Language: Starts with "It's important to remember," engaging the reader.
          Short Sentences: Breaks complex ideas into simpler statements.
          Professional Tone: Communicates expertise respectfully.
          Avoids Oversimplifying: Explains potential health issues without reducing them to simplistic terms.
          Retains Accuracy: Keeps all essential details about the progression and consequences of untreated insomnia.
          Example 4
          Original Complex Sentence:
          "Medical evaluations often include audiometric testing to assess the degree of hearing loss. Veterans may also experience related conditions such as tinnitus, which is a ringing in the ears."
          Simplified Version:
          "Doctors usually do hearing tests called audiometric tests to find out how much hearing loss you have. You might also have tinnitus, which means hearing ringing sounds in your ears."
          Explanation:
          Simple Language: Uses "hearing tests" and explains "audiometric tests."
          Technical Terms Explained: Provides definitions for "audiometric tests" and "tinnitus."
          Short Sentences: Enhances readability.
          Professional Tone: Maintains an authoritative voice.
          Empathetic Language: Uses "You might also have," acknowledging the reader's experience.
          Retains Essential Details: Includes key information about medical evaluations and related conditions.
          Example 5
          Original Complex Sentence:
          "Research indicates that combat deployment significantly increases the risk of new-onset hearing loss. Studies have highlighted the need for improved hearing protection and preventive strategies for military personnel."
          Simplified Version:
          "Studies show that going to combat can greatly increase the chance of hearing loss starting. It's important to know that better hearing protection is needed for people in the military to help prevent this."
          Explanation:
          Simple Language: Translates "combat deployment" to "going to combat" and "significantly increases the risk" to "greatly increase the chance."
          Empathetic Language: Begins with "It's important to know," making the tone more personable.
          Short Sentences: Separates ideas for better understanding.
          Professional Tone: Maintains respect and authority.
          Retains Accuracy: Keeps essential details about the findings and recommendations from research.
          Provides Clear Action Steps: Suggests the need for better hearing protection as a preventive measure.
          
          Lastly:
          - Please write to a 3rd-grade reading level, ensuring the language is simple, clear, and professional. Use short sentences and common words while maintaining an authoritative and respectful tone appropriate for expert communication. If technical terms are necessary, include a brief explanation in parentheses. Avoid sounding condescending; the goal is to make the information accessible without oversimplifying. Keep the content accurate and retain all essential details, so the reader feels informed and respected.
          Use Empathetic Language:
          Phrases like 'You might notice...' or 'It's important to remember...' can make the tone more personable.
          Provide Clear Action Steps:
          If applicable, offer straightforward guidance on what the reader can do next.

          Do not include any in-text citations.
          
          After saving the information, utilize the CompileDocument tool to build the document from your updates.
          `,
          message_template: `Using the following dependencies, create key points in markdown format using the SaveToKeyPoints tool for {condition_name} for user_id: {user_id} utilizing the information below:
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}`,
          result_keys: ["key_points"],
          tools: ["SaveToKeyPoints"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'separate'
          }
        },
        {
          name: "Future Considerations",
          agent_class: "ReportSectionWriter",
          shared_instructions: `Write future considerations using the SaveToKeyPoints tool for user_id: {user_id} for {condition_name} progression and management.

          The considerations should:
          1. Project potential condition progression
          2. Suggest monitoring approaches
          3. Identify warning signs
          4. Recommend preventive measures
          5. Include research-backed recommendations
          

                  Instructions for simplifing the writing:

          Original Complex Sentence:
          "Understand that insomnia is rated under the 38 CFR based on the severity of symptoms and their impact on daily life. Ratings can range from mild to severe, affecting your ability to function socially and occupationally."
          Simplified Version:
          "It's important to know that the VA rates insomnia (trouble sleeping) based on how bad your symptoms are and how they affect your daily life. You might notice that these ratings can be low or high, depending on how insomnia makes it difficult for you to be around others or do your job."
          Explanation:
          Simple Language: Uses common words like "how bad your symptoms are" instead of "severity of symptoms," and "do your job" instead of "function occupationally."
          Short Sentences: Breaks the information into clear, manageable sentences.
          Professional Tone: Maintains an authoritative voice appropriate for expert communication.
          Technical Terms Explained: Provides a brief explanation of "insomnia" as "trouble sleeping."
          Empathetic Language: Starts with "It's important to know" and includes "You might notice," making the tone more personable.
          Retains Essential Details: Keeps all critical information so the reader feels informed and respected.
          Example 2
          Original Complex Sentence:
          "Prepare by keeping a sleep diary for a few weeks before the exam. Note the time you go to bed, how long it takes to fall asleep, any awakenings during the night, and how you feel in the morning. This will help provide a clear picture of your sleep patterns."
          Simplified Version:
          "You might consider keeping a sleep diary before your exam. Write down when you go to bed, how long it takes to fall asleep, if you wake up at night, and how you feel in the morning. This will help show your sleep patterns."
          Explanation:
          Simple Language: Uses "write down" instead of "note," making it more accessible.
          Short Sentences: Presents one idea per sentence for clarity.
          Empathetic Language: Begins with "You might consider," offering gentle guidance.
          Clear Action Steps: Provides straightforward instructions on what the reader can do next.
          Professional Tone: Maintains respect and expertise without being condescending.
          Retains Details: Includes all necessary information for preparing for the exam.
          Example 3
          Original Complex Sentence:
          "Insomnia can become a chronic issue if not addressed early. It may lead to increased fatigue, mood disturbances, and cognitive impairments. Over time, chronic insomnia can contribute to more severe health issues such as depression, anxiety, and cardiovascular problems."
          Simplified Version:
          "It's important to remember that if trouble sleeping isn't helped early, it can become a long-term problem. This might make you feel more tired, affect your mood, and make thinking harder. Over time, not sleeping well can lead to serious health issues like depression, anxiety, and heart problems."
          Explanation:
          Simple Language: Uses "trouble sleeping" instead of "insomnia" and "long-term problem" instead of "chronic issue."
          Empathetic Language: Starts with "It's important to remember," engaging the reader.
          Short Sentences: Breaks complex ideas into simpler statements.
          Professional Tone: Communicates expertise respectfully.
          Avoids Oversimplifying: Explains potential health issues without reducing them to simplistic terms.
          Retains Accuracy: Keeps all essential details about the progression and consequences of untreated insomnia.
          Example 4
          Original Complex Sentence:
          "Medical evaluations often include audiometric testing to assess the degree of hearing loss. Veterans may also experience related conditions such as tinnitus, which is a ringing in the ears."
          Simplified Version:
          "Doctors usually do hearing tests called audiometric tests to find out how much hearing loss you have. You might also have tinnitus, which means hearing ringing sounds in your ears."
          Explanation:
          Simple Language: Uses "hearing tests" and explains "audiometric tests."
          Technical Terms Explained: Provides definitions for "audiometric tests" and "tinnitus."
          Short Sentences: Enhances readability.
          Professional Tone: Maintains an authoritative voice.
          Empathetic Language: Uses "You might also have," acknowledging the reader's experience.
          Retains Essential Details: Includes key information about medical evaluations and related conditions.
          Example 5
          Original Complex Sentence:
          "Research indicates that combat deployment significantly increases the risk of new-onset hearing loss. Studies have highlighted the need for improved hearing protection and preventive strategies for military personnel."
          Simplified Version:
          "Studies show that going to combat can greatly increase the chance of hearing loss starting. It's important to know that better hearing protection is needed for people in the military to help prevent this."
          Explanation:
          Simple Language: Translates "combat deployment" to "going to combat" and "significantly increases the risk" to "greatly increase the chance."
          Empathetic Language: Begins with "It's important to know," making the tone more personable.
          Short Sentences: Separates ideas for better understanding.
          Professional Tone: Maintains respect and authority.
          Retains Accuracy: Keeps essential details about the findings and recommendations from research.
          Provides Clear Action Steps: Suggests the need for better hearing protection as a preventive measure.
          
          Lastly:
          - Please write to a 3rd-grade reading level, ensuring the language is simple, clear, and professional. Use short sentences and common words while maintaining an authoritative and respectful tone appropriate for expert communication. If technical terms are necessary, include a brief explanation in parentheses. Avoid sounding condescending; the goal is to make the information accessible without oversimplifying. Keep the content accurate and retain all essential details, so the reader feels informed and respected.
          Use Empathetic Language:
          Phrases like 'You might notice...' or 'It's important to remember...' can make the tone more personable.
          Provide Clear Action Steps:
          If applicable, offer straightforward guidance on what the reader can do next.

          Do not include any in-text citations.`,
          message_template: `Using the following dependencies, outline future considerations in markdown format using the SaveToFutureConsiderations tool for {condition_name} for user_id: {user_id} utilizing the information below:
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}`,
          result_keys: ["future_considerations"],
          tools: ["SaveToFutureConsiderations"],
          dependencies: ["intake_info", "supplemental_info", "notes_information", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'separate'
          }
        },
        {
          name: "Condition Executive Summary",
          agent_class: "ReportSectionWriter",
          shared_instructions: `Write an executive summary using the SaveToConditionExecutiveSummary tool for {condition_name} for user_id: {user_id}.
          
          The summary should:
          1. Provide a comprehensive condition overview
          2. Highlight severity and impact
          3. Summarize service connection evidence
          4. Include key medical findings
          5. Reference supporting documentation
          6. Do not structure the paragraphs solely around the key points or 38 cfr tips, the writing should be all inclusive and personalize to the user's circumstances utilizing information that can be gathered from the research_sections, intake_info, supplemental_info, and notes_information.
          
          
          Instructions for simplifing the writing:

          Original Complex Sentence:
          "Understand that insomnia is rated under the 38 CFR based on the severity of symptoms and their impact on daily life. Ratings can range from mild to severe, affecting your ability to function socially and occupationally."
          Simplified Version:
          "It's important to know that the VA rates insomnia (trouble sleeping) based on how bad your symptoms are and how they affect your daily life. You might notice that these ratings can be low or high, depending on how insomnia makes it difficult for you to be around others or do your job."
          Explanation:
          Simple Language: Uses common words like "how bad your symptoms are" instead of "severity of symptoms," and "do your job" instead of "function occupationally."
          Short Sentences: Breaks the information into clear, manageable sentences.
          Professional Tone: Maintains an authoritative voice appropriate for expert communication.
          Technical Terms Explained: Provides a brief explanation of "insomnia" as "trouble sleeping."
          Empathetic Language: Starts with "It's important to know" and includes "You might notice," making the tone more personable.
          Retains Essential Details: Keeps all critical information so the reader feels informed and respected.
          Example 2
          Original Complex Sentence:
          "Prepare by keeping a sleep diary for a few weeks before the exam. Note the time you go to bed, how long it takes to fall asleep, any awakenings during the night, and how you feel in the morning. This will help provide a clear picture of your sleep patterns."
          Simplified Version:
          "You might consider keeping a sleep diary before your exam. Write down when you go to bed, how long it takes to fall asleep, if you wake up at night, and how you feel in the morning. This will help show your sleep patterns."
          Explanation:
          Simple Language: Uses "write down" instead of "note," making it more accessible.
          Short Sentences: Presents one idea per sentence for clarity.
          Empathetic Language: Begins with "You might consider," offering gentle guidance.
          Clear Action Steps: Provides straightforward instructions on what the reader can do next.
          Professional Tone: Maintains respect and expertise without being condescending.
          Retains Details: Includes all necessary information for preparing for the exam.
          Example 3
          Original Complex Sentence:
          "Insomnia can become a chronic issue if not addressed early. It may lead to increased fatigue, mood disturbances, and cognitive impairments. Over time, chronic insomnia can contribute to more severe health issues such as depression, anxiety, and cardiovascular problems."
          Simplified Version:
          "It's important to remember that if trouble sleeping isn't helped early, it can become a long-term problem. This might make you feel more tired, affect your mood, and make thinking harder. Over time, not sleeping well can lead to serious health issues like depression, anxiety, and heart problems."
          Explanation:
          Simple Language: Uses "trouble sleeping" instead of "insomnia" and "long-term problem" instead of "chronic issue."
          Empathetic Language: Starts with "It's important to remember," engaging the reader.
          Short Sentences: Breaks complex ideas into simpler statements.
          Professional Tone: Communicates expertise respectfully.
          Avoids Oversimplifying: Explains potential health issues without reducing them to simplistic terms.
          Retains Accuracy: Keeps all essential details about the progression and consequences of untreated insomnia.
          Example 4
          Original Complex Sentence:
          "Medical evaluations often include audiometric testing to assess the degree of hearing loss. Veterans may also experience related conditions such as tinnitus, which is a ringing in the ears."
          Simplified Version:
          "Doctors usually do hearing tests called audiometric tests to find out how much hearing loss you have. You might also have tinnitus, which means hearing ringing sounds in your ears."
          Explanation:
          Simple Language: Uses "hearing tests" and explains "audiometric tests."
          Technical Terms Explained: Provides definitions for "audiometric tests" and "tinnitus."
          Short Sentences: Enhances readability.
          Professional Tone: Maintains an authoritative voice.
          Empathetic Language: Uses "You might also have," acknowledging the reader's experience.
          Retains Essential Details: Includes key information about medical evaluations and related conditions.
          Example 5
          Original Complex Sentence:
          "Research indicates that combat deployment significantly increases the risk of new-onset hearing loss. Studies have highlighted the need for improved hearing protection and preventive strategies for military personnel."
          Simplified Version:
          "Studies show that going to combat can greatly increase the chance of hearing loss starting. It's important to know that better hearing protection is needed for people in the military to help prevent this."
          Explanation:
          Simple Language: Translates "combat deployment" to "going to combat" and "significantly increases the risk" to "greatly increase the chance."
          Empathetic Language: Begins with "It's important to know," making the tone more personable.
          Short Sentences: Separates ideas for better understanding.
          Professional Tone: Maintains respect and authority.
          Retains Accuracy: Keeps essential details about the findings and recommendations from research.
          Provides Clear Action Steps: Suggests the need for better hearing protection as a preventive measure.
          
          Lastly:
          - Please write to a 3rd-grade reading level, ensuring the language is simple, clear, and professional. Use short sentences and common words while maintaining an authoritative and respectful tone appropriate for expert communication. If technical terms are necessary, include a brief explanation in parentheses. Avoid sounding condescending; the goal is to make the information accessible without oversimplifying. Keep the content accurate and retain all essential details, so the reader feels informed and respected.
          Use Empathetic Language:
          Phrases like 'You might notice...' or 'It's important to remember...' can make the tone more personable.
          Provide Clear Action Steps:
          If applicable, offer straightforward guidance on what the reader can do next.

          Do not include any in-text citations such as 【4:0†source】. Remove these from the output.`,
          message_template: `Using the following dependencies, create an executive summary in markdown format using the SaveToConditionExecutiveSummary tool for {condition_name} for user_id: {user_id} utilizing the information below:
          - cfr_tips: {cfr_tips}
          - key_points: {key_points}
          - future_considerations: {future_considerations}
          - intake_info: {intake_info}
          - supplemental_info: {supplemental_info}
          - notes_information: {notes_information}
          `,
          result_keys: ["condition_executive_summary"],
          tools: ["SaveToConditionExecutiveSummary"],
          dependencies: [
            "cfr_tips",
            "key_points",
            "future_considerations",
            "intake_info",
            "supplemental_info",
            "notes_information",
            "user_id",
            "conditions"
          ],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'merge'
          }
        },
        {
          name: "Compile Condition Sections",
          agent_class: "CompileConditionSection",
          shared_instructions: `Compile the condition sections for user_id: {user_id}.`,
          tools: ["CompileConditionSection"],
          dependencies: ["condition_executive_summary", "cfr_tips", "key_points", "future_considerations", "research_sections", "cfr_research", "conditions", "user_id"],
          expansion_config: {
            type: 'array',
            process_array_output: true,
            identifiers: {
              'condition_name': 'condition.condition_name'
            },
            array_mapping: {
              "condition": "conditions"
            },
            output_format: 'merge'
          }
        }
      ], id, body.session_id, body.context_info),
      createTaskGroup("Overall Executive Summary", [{
        name: "Overall Executive Summary",
        agent_class: "ReportSectionWriter",
        shared_instructions: `Write an overall executive summary combining all condition summaries and use the SaveToReportExecutiveSummary tool for user_id: {user_id}.

        The overall summary should:
        1. Synthesize findings across all conditions
        2. Highlight key relationships between conditions
        3. Summarize total disability impact
        4. Note critical evidence and findings
        5. Provide a holistic view of the case
        
        Instructions for simplifing the writing:

        Original Complex Sentence:
        "Understand that insomnia is rated under the 38 CFR based on the severity of symptoms and their impact on daily life. Ratings can range from mild to severe, affecting your ability to function socially and occupationally."
        Simplified Version:
        "It's important to know that the VA rates insomnia (trouble sleeping) based on how bad your symptoms are and how they affect your daily life. You might notice that these ratings can be low or high, depending on how insomnia makes it difficult for you to be around others or do your job."
        Explanation:
        Simple Language: Uses common words like "how bad your symptoms are" instead of "severity of symptoms," and "do your job" instead of "function occupationally."
        Short Sentences: Breaks the information into clear, manageable sentences.
        Professional Tone: Maintains an authoritative voice appropriate for expert communication.
        Technical Terms Explained: Provides a brief explanation of "insomnia" as "trouble sleeping."
        Empathetic Language: Starts with "It's important to know" and includes "You might notice," making the tone more personable.
        Retains Essential Details: Keeps all critical information so the reader feels informed and respected.
        Example 2
        Original Complex Sentence:
        "Prepare by keeping a sleep diary for a few weeks before the exam. Note the time you go to bed, how long it takes to fall asleep, any awakenings during the night, and how you feel in the morning. This will help provide a clear picture of your sleep patterns."
        Simplified Version:
        "You might consider keeping a sleep diary before your exam. Write down when you go to bed, how long it takes to fall asleep, if you wake up at night, and how you feel in the morning. This will help show your sleep patterns."
        Explanation:
        Simple Language: Uses "write down" instead of "note," making it more accessible.
        Short Sentences: Presents one idea per sentence for clarity.
        Empathetic Language: Begins with "You might consider," offering gentle guidance.
        Clear Action Steps: Provides straightforward instructions on what the reader can do next.
        Professional Tone: Maintains respect and expertise without being condescending.
        Retains Details: Includes all necessary information for preparing for the exam.
        Example 3
        Original Complex Sentence:
        "Insomnia can become a chronic issue if not addressed early. It may lead to increased fatigue, mood disturbances, and cognitive impairments. Over time, chronic insomnia can contribute to more severe health issues such as depression, anxiety, and cardiovascular problems."
        Simplified Version:
        "It's important to remember that if trouble sleeping isn't helped early, it can become a long-term problem. This might make you feel more tired, affect your mood, and make thinking harder. Over time, not sleeping well can lead to serious health issues like depression, anxiety, and heart problems."
        Explanation:
        Simple Language: Uses "trouble sleeping" instead of "insomnia" and "long-term problem" instead of "chronic issue."
        Empathetic Language: Starts with "It's important to remember," engaging the reader.
        Short Sentences: Breaks complex ideas into simpler statements.
        Professional Tone: Communicates expertise respectfully.
        Avoids Oversimplifying: Explains potential health issues without reducing them to simplistic terms.
        Retains Accuracy: Keeps all essential details about the progression and consequences of untreated insomnia.
        Example 4
        Original Complex Sentence:
        "Medical evaluations often include audiometric testing to assess the degree of hearing loss. Veterans may also experience related conditions such as tinnitus, which is a ringing in the ears."
        Simplified Version:
        "Doctors usually do hearing tests called audiometric tests to find out how much hearing loss you have. You might also have tinnitus, which means hearing ringing sounds in your ears."
        Explanation:
        Simple Language: Uses "hearing tests" and explains "audiometric tests."
        Technical Terms Explained: Provides definitions for "audiometric tests" and "tinnitus."
        Short Sentences: Enhances readability.
        Professional Tone: Maintains an authoritative voice.
        Empathetic Language: Uses "You might also have," acknowledging the reader's experience.
        Retains Essential Details: Includes key information about medical evaluations and related conditions.
        Example 5
        Original Complex Sentence:
        "Research indicates that combat deployment significantly increases the risk of new-onset hearing loss. Studies have highlighted the need for improved hearing protection and preventive strategies for military personnel."
        Simplified Version:
        "Studies show that going to combat can greatly increase the chance of hearing loss starting. It's important to know that better hearing protection is needed for people in the military to help prevent this."
        Explanation:
        Simple Language: Translates "combat deployment" to "going to combat" and "significantly increases the risk" to "greatly increase the chance."
        Empathetic Language: Begins with "It's important to know," making the tone more personable.
        Short Sentences: Separates ideas for better understanding.
        Professional Tone: Maintains respect and authority.
        Retains Accuracy: Keeps essential details about the findings and recommendations from research.
        Provides Clear Action Steps: Suggests the need for better hearing protection as a preventive measure.
        
        Lastly:
        - Please write to a 3rd-grade reading level, ensuring the language is simple, clear, and professional. Use short sentences and common words while maintaining an authoritative and respectful tone appropriate for expert communication. If technical terms are necessary, include a brief explanation in parentheses. Avoid sounding condescending; the goal is to make the information accessible without oversimplifying. Keep the content accurate and retain all essential details, so the reader feels informed and respected.
        Use Empathetic Language:
        Phrases like 'You might notice...' or 'It's important to remember...' can make the tone more personable.
        Provide Clear Action Steps:
        If applicable, offer straightforward guidance on what the reader can do next.

        Do not include any in-text citations such as 【4:0†source】. Remove these from the output.`,
        message_template: `Using the following dependencies, create an overall executive summary in markdown format for user_id: {user_id} utilizing the information below:
        - condition_executive_summary: {condition_executive_summary}
        - research_sections: {research_sections}
        - cfr_tips: {cfr_tips}
        - key_points: {key_points}
        - future_considerations: {future_considerations}
        - intake_info: {intake_info}
        - supplemental_info: {supplemental_info}
        - notes_information: {notes_information}`,
        result_keys: ["report_summary"],
        tools: ["SaveToReportExecutiveSummary"],
        dependencies: ["condition_executive_summary", "research_sections", "cfr_tips", "key_points", "future_considerations", "intake_info", "supplemental_info", "notes_information", "user_id"],
        process_at_item_level: false
      },
      {
        name: "Write Static Sections",
        agent_class: "ReportSectionWriter",
        shared_instructions: "Write the static sections of the report that don't vary by condition for user_id: {user_id}. After saving the information, utilize the CompileDocument tool to build the document from your updates.",
        message_template: `Write the static sections of the report including standard operating procedures, checklists, mental C&P tips, online filing guide, letter, FAQs, how to contest claim, other possible benefits, and glossary for the report for user_id: {user_id}. You only need to run this tool one time.`,
        result_keys: ["static_sections"],
        tools: ["SaveToStaticSections"],
        dependencies: ["user_id"],
        process_at_item_level: false
      }
    ], id, body.session_id, body.context_info),
    createTaskGroup("Compile Report", [{
      name: "Write Report",
      agent_class: "ReportSectionWriter",
      shared_instructions: "Write the final report for user_id: {user_id}.",
      message_template: `Write the final report for user_id: {user_id}.
      
      Utilize the CompileDocument tool to update the final report after it is written.
      Example: CompileDocument()`,
      result_keys: ["final_document"],
      tools: ["CompileDocument"],
      dependencies: ["static_sections", "report_summary", "personal_statements", "condition_executive_summary", "nexus_letters", "research_sections", "cfr_tips", "key_points", "future_considerations", "user_id"],
      optional_dependencies: ["static_sections", "report_summary", "personal_statements", "condition_executive_summary", "nexus_letters", "research_sections", "cfr_tips", "key_points", "future_considerations"],
      order: -1
    }], id, body.session_id, body.context_info)
  ];


  // Combine all task groups
  const allTaskGroups = [...taskGroups, ...storyTaskGroups];
  
  // Add validation for selectedTasks
  if (!body.selectedTasks || !Array.isArray(body.selectedTasks) || body.selectedTasks.length === 0) {
    console.error('Missing or invalid selectedTasks in request body');
    return NextResponse.json({ error: 'Missing or invalid selectedTasks' }, { status: 400 })
  }

  // Filter task groups based on selection
  const taskGroupsPayload = allTaskGroups.filter(group => {
    // Check which task groups we should include based on the selected grouping type
    const isStoryWritingTask = body.selectedTasks.some(task => 
      storyTaskGroups.some(storyGroup => 
        storyGroup.tasks.some(storyTask => storyTask.name === task)
      )
    );

    // If story writing tasks are selected, only include story task groups
    if (isStoryWritingTask) {
      return storyTaskGroups.some(storyGroup => storyGroup.name === group.name);
    }

    // For standard tasks, include only standard task groups
    return taskGroups.some(standardGroup => standardGroup.name === group.name);
  }).map(group => {
    // Filter tasks within each group to only include selected ones
    return {
      ...group,
      tasks: group.tasks.filter(task => body.selectedTasks.includes(task.name))
    };
  }).filter(group => group.tasks.length > 0); // Only include groups that have selected tasks

  // Debug logging
  console.log('Task Selection:', {
    selectedTasks: body.selectedTasks,
    selectedTaskGroups: body.selectedTaskGroups,
    isStoryWritingTask: body.selectedTasks.some(task => 
      storyTaskGroups.some(storyGroup => 
        storyGroup.tasks.some(storyTask => storyTask.name === task)
      )
    ),
    filteredGroups: taskGroupsPayload.map(g => g.name)
  });

  // Create the message payload with filtered task groups
  const messagePayload = {
    key: `task_group:${id}`,
    action: 'initialize',
    object: {
      key: `task_group:${id}`,
      name: body.node_template_name,
      node_template_name: body.node_template_name,
      description: body.task?.description || nodeTemplate?.description || 'Default description',
      id: id,
      session_id: groupSessionId,
      user_id: body.user_id,
      output: reportStructure,
      task_groups: taskGroupsPayload,
    },
    context: {
      key: `task_group:${id}`,
      input_description: body.task?.input_description || nodeTemplate?.input_description || '',
      action_summary: body.task?.action_summary || nodeTemplate?.action_summary || '',
      outcome_description: body.task?.outcome_description || nodeTemplate?.outcome_description || '',
      feedback: body.task?.feedback || nodeTemplate?.feedback || [],
      context: {
        user_id: body.user_id,
        object_contexts: objectContexts,
        topics: body.topics,
        conditions: serializedConditions,
        context_values: {
          user_id: body.user_id
        }
      },
      ...(body.context_info || {})
    }
  };

  // Create the Kafka message
  const message: ProduceRequest[] = [{
    topic: topic,
    messages: [JSON.stringify(messagePayload)]
  }];

  // Add debug logging
  console.log('Task Groups Payload:', taskGroupsPayload);
  console.log('Message Payload:', messagePayload);
  console.log('Final Message:', message);

  return new Promise((resolve) => {
    producer.on('ready', function () {
      console.log('Kafka producer is ready');
      producer.send(message, function (err, data) {
        if (err) {
          console.error('Error sending Kafka message:', err);
          resolve(NextResponse.json({ error: 'Failed to send Kafka message' }, { status: 500 }))
        } else {
          console.log('Kafka message sent successfully:', data);
          resolve(NextResponse.json({ success: true, data }, { status: 200 }))
        }
      })
    })

    producer.on('error', function (err) {
      console.error('Kafka producer error:', err);
      resolve(NextResponse.json({ error: 'Kafka producer error' }, { status: 500 }))
    })
  })
}
