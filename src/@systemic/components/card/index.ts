import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GuruContent, GuruHeader, GuruFooter } from './helper';
import { GuruCardComponent } from './guru-card.component';
import { GuruCardScrollerDirective, GuruCardSidebarDirective } from './directives';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    declarations: [GuruCardComponent, GuruHeader, GuruContent, GuruFooter,
        GuruCardSidebarDirective, GuruCardScrollerDirective],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatSidenavModule
    ],
    exports: [GuruCardComponent, GuruHeader, GuruContent, GuruFooter, GuruCardSidebarDirective]
})
export class GuruCardModule { }
