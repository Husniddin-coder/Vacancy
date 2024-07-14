import { Id } from "src/app/modules/shared/models/Id.interface";

export interface VacancyGetDto extends Id {
    /* public int Id { get; set; }

     public string Title { get; set; }

     public string Description { get; set; }

     public decimal Salary { get; set; }

     public string Region { get; set; } // added by me

     public string Company { get; set; } // added by me

     public string WorkingDays { get; set; }

     public string QualificationRequirements { get; set; }

     public DateTime JobStartDate { get; set; }*/

    title: string;
    description: string;
    salary: number;
    region: string;
    company: string;
    workingDays: string;
    qualificationRequirements: string;
    jobStartDate: string;
}

export interface VacancyPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface Params {
    page: number,
    size: number,
    sort?: string,
    order?: string;
    search?: string;
}