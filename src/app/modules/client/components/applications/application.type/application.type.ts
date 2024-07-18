import { Id } from "src/app/modules/shared/models/Id.interface";

export interface ApplicationGetDto extends Id {
    status: ApplicationStatus
    fullName: string;
    passportPath: string;
    phoneNumber: string;
    email: string;
    address: string;
    vacancyTitle: string;
    vacancyCompany: string;
    createdDate: string;
    vacancyId: number;
}

export enum ApplicationStatus{
    Submitted = 0,
    Accepted = 1,
    Rejected = 2,
}

export interface appStatus{
    name: string,
    code: string
}

export interface ApplicationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}