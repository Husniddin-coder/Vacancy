import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/modules/shared/services/base.service';

@Injectable({ providedIn: 'root' })
export class VacancyService {

    constructor(private base$: BaseService) { }

    getAll() {

    }

}