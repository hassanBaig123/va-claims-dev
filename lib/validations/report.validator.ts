import { z } from "zod";
import { ReportSchema, type ValidReport } from "./report.schema";

interface ValidationError {
  path: string[];
  message: string;
}

interface SectionValidationResult {
  isValid: boolean;
  completionScore: number;
  errors: ValidationError[];
  requiredFieldCount: number;
  completedFieldCount: number;
}

interface ValidationResult {
  isValid: boolean;
  completionPercentage: number;
  sectionResults: Record<string, SectionValidationResult>;
  totalErrors: ValidationError[];
  criticalErrors: ValidationError[];
  warnings: ValidationError[];
  metadata: {
    totalSections: number;
    completedSections: number;
    requiredSections: number;
    optionalSections: number;
  };
}

type ReportSchemaShape = z.infer<typeof ReportSchema>
type ReportSchemaKeys = keyof ReportSchemaShape
type SchemaShape = typeof ReportSchema extends z.ZodObject<infer Shape> ? Shape : never;

export class ReportValidator {
  private static readonly CRITICAL_SECTIONS = [
    'executive_summary',
    'conditions',
    'personalStatementLetters',
    'nexusLetters',
    'standardOperatingProcedure'
  ] as const;

  private static readonly SECTION_WEIGHTS: Partial<Record<ReportSchemaKeys, number>> = {
    executive_summary: 1,
    conditions: 1,
    personalStatementLetters: 1,
    nexusLetters: 1,
    standardOperatingProcedure: 1
  } as const;

  /**
   * Converts a path array to string array
   */
  private static normalizePath(path: (string | number)[]): string[] {
    return path.map(String);
  }

  /**
   * Gets required fields count from a schema
   */
  private static getRequiredFieldCount(schema: z.ZodType<any>): number {
    if (schema instanceof z.ZodObject) {
      const shapeValues = Object.values(schema.shape) as z.ZodTypeAny[];
      return shapeValues.filter(field => !field.isOptional()).length;
    }
    return schema.isOptional() ? 0 : 1;
  }

  /**
   * Checks if a field is completed
   */
  private static isFieldComplete(value: any): boolean {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }

  /**
   * Validates a specific section of the report
   */
  private static validateSection(report: any, sectionName: string): SectionValidationResult {
    try {
        const sectionData = report[sectionName];
        const errors: ValidationError[] = [];
        let completionScore = 0;
        let requiredFieldCount = 1; // Each section is required
        let completedFieldCount = 0;

        if (sectionData === undefined || sectionData === null) {
            errors.push({
                path: [sectionName],
                message: `${sectionName} section is missing`
            });
        } else if (Array.isArray(sectionData)) {
            completedFieldCount = sectionData.length > 0 ? 1 : 0;
            if (sectionData.length === 0) {
                errors.push({
                    path: [sectionName],
                    message: `${sectionName} array is empty`
                });
            }
        } else if (typeof sectionData === 'object') {
            completedFieldCount = Object.keys(sectionData).length > 0 ? 1 : 0;
            if (Object.keys(sectionData).length === 0) {
                errors.push({
                    path: [sectionName],
                    message: `${sectionName} object is empty`
                });
            }
        } else if (sectionData) {
            completedFieldCount = 1;
        }

        completionScore = (completedFieldCount / requiredFieldCount) * 100;

        return {
            isValid: errors.length === 0 && completionScore === 100,
            completionScore,
            errors,
            requiredFieldCount,
            completedFieldCount
        };
    } catch (error) {
        console.error(`Error validating section ${sectionName}:`, error);
        return {
            isValid: false,
            completionScore: 0,
            errors: [{
                path: [sectionName],
                message: error instanceof Error ? error.message : 'Unknown error'
            }],
            requiredFieldCount: 1,
            completedFieldCount: 0
        };
    }
  }

  /**
   * Validates nested arrays within a section
   */
  private static validateArraySection(
    data: any[],
    itemSchema: z.ZodType<any>
  ): number {
    if (!Array.isArray(data) || data.length === 0) return 0;

    const validItems = data.filter((item) => 
      itemSchema.safeParse(item).success
    ).length;

    return (validItems / data.length) * 100;
  }

  /**
   * Checks if a section is considered critical
   */
  private static isCriticalSection(sectionName: ReportSchemaKeys): boolean {
    return this.CRITICAL_SECTIONS.includes(sectionName as typeof this.CRITICAL_SECTIONS[number]);
  }

  /**
   * Gets the weight for a specific section
   */
  private static getSectionWeight(sectionName: ReportSchemaKeys): number {
    if (this.SECTION_WEIGHTS.hasOwnProperty(sectionName)) {
      return this.SECTION_WEIGHTS[sectionName as keyof typeof this.SECTION_WEIGHTS] ?? 1;
    }
    return 1;
  }

  private static validateCondition(condition: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Define required fields for each condition
    const requiredFields = [
      'executive_summary',
      'condition_name', 
      'research_section',
    ];

    requiredFields.forEach(field => {
      if (!condition[field] || 
          (typeof condition[field] === 'string' && !condition[field].trim()) ||
          (Array.isArray(condition[field]) && condition[field].length === 0)) {
        errors.push({
          path: ['conditions'],
          message: `Missing ${field} in condition: ${condition.condition_name || 'Unnamed Condition'}`
        });
      }
    });

    return errors;
  }

  /**
   * Validates the entire report
   */
  public static validateReport(reportData: any): ValidationResult {
    try {
        // Handle empty/new reports
        if (!reportData || Object.keys(reportData).length === 0) {
            return this.createEmptyValidationResult('New report - no content yet');
        }
        
        console.log('Starting validation for report:', {
            reportDataType: typeof reportData,
            hasData: !!reportData,
            isString: typeof reportData === 'string',
            keys: reportData ? Object.keys(reportData) : []
        });

        let report = this.parseReportData(reportData);
        
        if (!report) {
            console.warn('No valid report data found after parsing');
            return this.createEmptyValidationResult('Invalid report data structure');
        }

        // Initialize validation result
        const result: ValidationResult = {
            isValid: false,
            completionPercentage: 0,
            sectionResults: {},
            totalErrors: [],
            criticalErrors: [],
            warnings: [],
            metadata: {
                totalSections: 0,
                completedSections: 0,
                requiredSections: 0,
                optionalSections: 0
            }
        };

        // Define required sections with their minimum requirements
        const requiredSections = {
            'executive_summary': {
                check: (data: any) => Array.isArray(data) && data.length > 0,
                message: 'Missing executive summary section'
            },
            'conditions': {
                check: (data: any) => {
                    if (!Array.isArray(data) || data.length === 0) return false;
                    const conditionErrors: ValidationError[] = [];
                    data.forEach((condition, index) => {
                        const errors = this.validateCondition(condition);
                        if (errors.length > 0) {
                            conditionErrors.push(...errors);
                        }
                    });
                    return conditionErrors.length === 0;
                },
                message: 'Conditions section requires valid condition entries'
            },
            'personalStatementLetters': {
                check: (data: any) => Array.isArray(data) && data.length > 0 && data.some((letter: any) => letter.content),
                message: 'Missing or incomplete personal statement letters'
            },
            'nexusLetters': {
                check: (data: any) => Array.isArray(data) && data.length > 0,
                message: 'Missing nexus letters'
            },
            'standardOperatingProcedure': {
                check: (data: any) => data && typeof data === 'object' && Object.keys(data).length > 0,
                message: 'Missing standard operating procedure'
            }
        };

        let completedSections = 0;
        const totalSections = Object.keys(requiredSections).length;

        // Validate each required section
        Object.entries(requiredSections).forEach(([section, validator]) => {
            console.log(`Validating section: ${section}`, {
                hasSection: !!report[section],
                sectionData: report[section],
                validationResult: validator.check(report[section])
            });
            
            const sectionResult = this.validateSection(report, section);
            result.sectionResults[section] = sectionResult;

            if (!report[section] || !validator.check(report[section])) {
                const error = {
                    path: [section],
                    message: validator.message
                };
                result.totalErrors.push(error);
                if (this.isCriticalSection(section as any)) {
                    result.criticalErrors.push(error);
                } else {
                    result.warnings.push(error);
                }
            } else {
                completedSections++;
            }
        });

        // Calculate completion percentage with partial credit
        let totalProgress = 0;
        let totalWeight = 0;

        console.log('Starting validation with sections:', {
            availableSections: Object.keys(report),
            criticalSections: this.CRITICAL_SECTIONS
        });

        this.CRITICAL_SECTIONS.forEach(sectionName => {
            const sectionExists = report[sectionName] !== undefined;
            const weight = sectionExists ? this.getSectionWeight(sectionName) : 0;
            const progress = sectionExists ? this.calculateSectionProgress(report[sectionName], sectionName) : 0;
            
            console.log(`Section ${sectionName}:`, {
                exists: sectionExists,
                data: report[sectionName],
                weight,
                progress,
                weightedProgress: progress * weight,
                currentTotal: totalProgress
            });
            
            if (sectionExists) {
                totalProgress += progress * weight;
                totalWeight += weight;
            }
        });

        console.log('Final calculation details:', {
            totalProgress,
            totalWeight,
            sections: {
                total: this.CRITICAL_SECTIONS.length,
                present: totalWeight, // since weight is 1 per section, this equals number of sections
            },
            calculation: `${totalProgress} / ${totalWeight} * 100 = ${(totalProgress / totalWeight) * 100}%`
        });

        result.completionPercentage = Math.round(
            totalWeight > 0 ? (totalProgress / totalWeight) * 100 : 0
        );

        result.isValid = result.criticalErrors.length === 0;
        result.metadata = {
            totalSections,
            completedSections,
            requiredSections: totalSections,
            optionalSections: 0
        };

        // Log final results
        console.log('Validation complete:', {
            isValid: result.isValid,
            completionPercentage: result.completionPercentage,
            criticalErrors: result.criticalErrors,
            warnings: result.warnings
        });

        return result;
    } catch (error) {
        console.error('Validation error:', error);
        return this.createEmptyValidationResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private static calculateSectionProgress(content: any, section?: string): number {
    console.log(`Calculating progress for section: ${section}`, {
        contentType: typeof content,
        isArray: Array.isArray(content),
        content: content
    });

    if (!content) return 0;
    
    // Special handling for conditions array
    if (section === 'conditions' && Array.isArray(content)) {
        // Just check if there are any conditions
        return content.length > 0 ? 1 : 0;
    }
    
    if (Array.isArray(content)) {
        // Must have at least one valid item
        return content.length > 0 ? 1 : 0;
    }
    
    if (typeof content === 'string') {
        // Must have non-empty content
        return content.trim().length > 0 ? 1 : 0;
    }
    
    if (typeof content === 'object' && content !== null) {
        // Must have required properties based on section
        const hasRequiredProps = Object.keys(content).length > 0;
        return hasRequiredProps ? 1 : 0;
    }
    
    return 0;
  }

  /**
   * Generates a human-readable validation report
   */
  public static generateValidationSummary(result: ValidationResult): string {
    const summary = [
      `Report Completion: ${result.completionPercentage}%`,
      `Sections: ${result.metadata.completedSections}/${result.metadata.totalSections} completed`,
      '',
      'Critical Issues:',
      ...result.criticalErrors.map((error) => `- ${error.message}`),
      '',
      'Warnings:',
      ...result.warnings.map((error) => `- ${error.message}`),
      '',
      'Section Details:',
    ];

    Object.entries(result.sectionResults).forEach(([sectionName, sectionResult]) => {
      summary.push(
        `${sectionName}:`,
        `  Completion: ${sectionResult.completionScore}%`,
        `  Fields: ${sectionResult.completedFieldCount}/${sectionResult.requiredFieldCount} completed`,
        sectionResult.errors.length > 0
          ? `  Errors: ${sectionResult.errors.map((e) => e.message).join(', ')}`
          : '  Status: Valid',
        ''
      );
    });

    return summary.join('\n');
  }

  private static parseReportData(reportData: any): any {
    console.log('Parsing report data:', {
        type: typeof reportData,
        isNull: reportData === null,
        isUndefined: reportData === undefined,
        keys: reportData ? Object.keys(reportData) : []
    });

    if (!reportData) return null;
    
    try {
        // If it's a string, try to parse it
        if (typeof reportData === 'string') {
            const parsed = JSON.parse(reportData);
            console.log('Parsed string data:', {
                hasDecryptedReport: !!parsed?.decrypted_report,
                hasReport: !!parsed?.report,
                keys: Object.keys(parsed)
            });
            return parsed?.decrypted_report || parsed?.report || parsed;
        }
        
        // If it's an object, check for nested report structures
        const result = reportData?.decrypted_report || reportData?.report || reportData;
        console.log('Extracted report data:', {
            hasData: !!result,
            keys: result ? Object.keys(result) : []
        });
        return result;
    } catch (error) {
        console.error('Error parsing report:', error);
        return reportData;
    }
  }

  private static createEmptyValidationResult(errorMessage: string): ValidationResult {
    return {
        isValid: false,
        completionPercentage: 0,
        sectionResults: {
            // Add default sections with 0% completion
            executive_summary: {
                isValid: false,
                completionScore: 0,
                errors: [],
                requiredFieldCount: 1,
                completedFieldCount: 0
            },
            conditions: {
                isValid: false,
                completionScore: 0,
                errors: [],
                requiredFieldCount: 1,
                completedFieldCount: 0
            },
            personalStatementLetters: {
                isValid: false,
                completionScore: 0,
                errors: [],
                requiredFieldCount: 1,
                completedFieldCount: 0
            },
            nexusLetters: {
                isValid: false,
                completionScore: 0,
                errors: [],
                requiredFieldCount: 1,
                completedFieldCount: 0
            },
        },
        totalErrors: [{
            path: ['root'],
            message: errorMessage
        }],
        criticalErrors: [{
            path: ['root'],
            message: errorMessage
        }],
        warnings: [],
        metadata: {
            totalSections: this.CRITICAL_SECTIONS.length,
            completedSections: 0,
            requiredSections: this.CRITICAL_SECTIONS.length,
            optionalSections: 0
        }
    };
  }
}

// Usage example:
export const validateReport = (report: any): ReturnType<typeof ReportValidator.validateReport> => {
  return ReportValidator.validateReport(report);
};
