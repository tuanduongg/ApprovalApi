import { Controller } from '@nestjs/common';
import {  HistoryOutJigService } from './history_concept.service';


@Controller('history-out-jig')
export class HistoryOutJigController {
    constructor(
        private service: HistoryOutJigService
    ) {

    }


}
