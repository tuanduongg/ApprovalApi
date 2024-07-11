import { Controller } from '@nestjs/common';
import { HistoryConceptService } from './history_concept.service';


@Controller('history-concept')
export class HistoryConceptController {
    constructor(
        private service: HistoryConceptService
    ) {

    }


}
