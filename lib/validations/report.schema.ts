import { z } from "zod";

// Helper sub-schemas
const CategorySchema = z.object({
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

const ResourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  url: z.string().url("Invalid URL"),
});

const StepSchema = z.object({
  title: z.string().min(1, "Step title is required"),
  description: z.string().min(1, "Step description is required"),
  resources: z.array(ResourceSchema),
});

const LetterSchema = z.object({
  salutation: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  closing: z.object({
    message: z.string().optional(),
    signature: z.string().optional(),
    title: z.string().optional(),
  }).optional(),
});

// Main Report Schema
export const ReportSchema = z.object({
  executive_summary: z.array(z.string().min(1)).min(1, "At least one executive summary point is required"),
  overviewOfConditions: z.string().min(50, "Overview must be at least 50 characters"),
  legendExplanation: z.object({
    introduction: z.string().min(1, "Legend introduction is required"),
    categories: z.array(CategorySchema).min(1, "At least one category is required"),
  }),
  conditionsSectionIntro: z.array(z.any()).min(1, "At least one condition section intro is required"),
  conditions: z.array(z.any()).min(1, "At least one condition is required"),
  nonCompensableConditions: z.array(z.string()).optional(),
  personalStatementLetters: z.array(z.any()).min(1, "At least one personal statement letter is required"),
  nexusLetters: z.array(z.any()).min(1, "At least one nexus letter is required"),
  standardOperatingProcedure: z.string().min(50, "SOP must be at least 50 characters"),
  onlineFilingGuide: z.object({
    title: z.string().min(1, "Guide title is required"),
    introduction: z.string().optional(),
    steps: z.array(StepSchema).min(1, "At least one step is required"),
    additionalResources: z.array(ResourceSchema).optional(),
  }),
  howToContestClaim: z.string().min(50, "Contest claim section must be at least 50 characters"),
  otherPossibleBenefits: z.array(z.string()).min(1, "At least one other possible benefit is required"),
  glossary: z.array(z.any()).min(1, "At least one glossary term is required"),
  faqs: z.any().optional(),
  letter: LetterSchema,
  checklist: z.object({
    title: z.string().min(1, "Checklist title is required"),
    sections: z.array(z.object({
      title: z.string().min(1, "Section title is required"),
      items: z.array(z.string()).min(1, "At least one checklist item is required"),
      tips: z.array(z.string()).optional(),
    })).min(1, "At least one checklist section is required"),
  }),
  mentalCAndPTips: z.object({
    sections: z.array(z.object({
      title: z.string().min(1, "Section title is required"),
      tips: z.array(z.string()).min(1, "At least one tip is required"),
    })).min(1, "At least one mental C&P tips section is required"),
  }).optional(),
});

export type ValidReport = z.infer<typeof ReportSchema>;

// Scoring system
export const calculateSectionScore = (section: any, schema: z.ZodType<any>): number => {
  const result = schema.safeParse(section);
  if (result.success) return 1;
  
  if (typeof section !== 'object' || section === null) return 0;
  
  // For arrays, calculate percentage of valid items
  if (Array.isArray(section)) {
    if (section.length === 0) return 0;
    const validItems = section.filter(item => schema.safeParse(item).success).length;
    return validItems / section.length;
  }
  
  // For objects, calculate percentage of valid properties
  const properties = Object.keys(section);
  if (properties.length === 0) return 0;
  
  const validProperties = properties.filter(prop => {
    const propSchema = (schema as any)._def.shape()[prop];
    return propSchema && propSchema.safeParse(section[prop]).success;
  }).length;
  
  return validProperties / properties.length;
};

export const calculateReportCompletion = (report: Partial<ValidReport>) => {
  const sections = Object.keys(ReportSchema.shape);
  const sectionWeights: Record<string, number> = {
    executive_summary: 1,
    overviewOfConditions: 1,
    legendExplanation: 1,
    conditions: 2, // Higher weight for critical sections
    personalStatementLetters: 2,
    nexusLetters: 2,
    // ... add weights for other sections
  };

  let totalScore = 0;
  let totalWeight = 0;
  const sectionScores: Record<string, number> = {};
  const missingFields: string[] = [];
  sections.forEach(sectionKey => {
    const schema = ReportSchema.shape[sectionKey as keyof typeof ReportSchema.shape];
    const weight = sectionWeights[sectionKey] || 1;
    const isOptional = schema.isOptional();
    
    if (!report[sectionKey as keyof ValidReport] && !isOptional) {
      missingFields.push(sectionKey);
      sectionScores[sectionKey] = 0;
    } else if (report[sectionKey as keyof ValidReport]) {
      const score = calculateSectionScore(
        report[sectionKey as keyof ValidReport],
        schema
      );
      sectionScores[sectionKey] = score;
      totalScore += score * weight;
      totalWeight += weight;
    }
  });

  const completionPercentage = Math.round((totalScore / totalWeight) * 100);

  return {
    isComplete: completionPercentage === 100,
    completionPercentage,
    sectionScores,
    missingFields,
    totalSections: sections.length,
    completedSections: sections.length - missingFields.length,
  };
};
