import { Pipe, PipeTransform } from '@angular/core';
import { StartupService } from '@core';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {
    constructor(private startupService: StartupService) {}

    public transform(value: string, lang = 'en'): any {
        return this.startupService.langData[value][lang];
    }
}

