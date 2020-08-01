import { NgModule } from '@angular/core';
import { CurrencyGuruPipe } from './currency.pipe';
import { DateGuruPipe } from './date.pipe';


@NgModule({
    imports: [],
    exports: [CurrencyGuruPipe, DateGuruPipe],
    declarations: [CurrencyGuruPipe, DateGuruPipe],
})
export class GuruPipeModule { }
