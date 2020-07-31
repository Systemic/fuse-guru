import { Directive, Input, TemplateRef } from '@angular/core';
import { Guru } from '@systemic/helper';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[guru-sidebar]' })
export class GuruCardSidebarDirective {
    @Input('guru-sidebar') position: 'left' | 'right';
    @Input() mode?: 'push' | 'over' | 'side';
    @Input() autoFocus?: boolean;
    @Input() disableClose?: boolean;
    @Input() opened?: boolean;
    @Input() responsive?: boolean;
    @Input() size?: string;
    @Input() width?: string;

    constructor(public template: TemplateRef<any>) {
        this.mode = !Guru.isValidObj(this.mode) ? 'side' : this.mode;
        this.opened = !Guru.isValidObj(this.opened) ? true : this.opened;
        this.responsive = !Guru.isValidObj(this.responsive) ? true : this.responsive;
        this.autoFocus = !Guru.isValidObj(this.autoFocus) ? true : this.autoFocus;
        this.disableClose = !Guru.isValidObj(this.disableClose) ? false : this.disableClose;
    }
}
