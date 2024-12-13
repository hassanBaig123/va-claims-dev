
export interface VideoInterface {
    videoTitle?:string;
    videoId?:string;
    description?:string
}

export interface ModuleInterface {
moduleId?: any;
moduleTitle?: string;
videos?: VideoInterface[]
}

export interface CourseInterface {
    id?: string;
    name?: string;
    product_id?: string;
    content?: {
      courseTitle?: string;
      courseDescription?: string;
      modules: ModuleInterface[];
    };
    user_data?: any;
}