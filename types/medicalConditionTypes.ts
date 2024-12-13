export interface KeyPoint {
    pointTitle: string;
    point: string;
  }
  
  export interface Research {
    researchTitle: string;
    authorName: string;
    researchUrl: string;
    summaryOfResearch: string;
  }
  
  export interface PointsFor38CFR {
    pointTitle: string;
    point: string;
  }
  
  export interface FutureConsideration {
    considerationTitle: string;
    consideration: string;
  }


  export interface MedicalConditionsIntroduction {
    conditionsSectionIntro: string;   
  }
  
  export interface MedicalCondition {
    condition_name: string;
    description: string;
    approvalRate: string;
    color: string;
    shortDescriptor: string;
    conditionType: string;
    executive_summary: string;
    key_points: KeyPoint[];
    research_section: Research[];
    PointsFor38CFR: PointsFor38CFR[];
    future_considerations: FutureConsideration[];
  }