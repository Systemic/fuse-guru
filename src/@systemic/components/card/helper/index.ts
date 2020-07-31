// tslint:disable: no-host-metadata-property
// tslint:disable: component-class-suffix
// tslint:disable: directive-selector
import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'guru-header',
    template: `
        <mat-toolbar class="guru-header-toolbar">
            <ng-content></ng-content>
        </mat-toolbar>
    `,
    host: {
        class: 'guru-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GuruHeader { }

@Component({
    selector: 'guru-content',
    template: `
        <ng-content></ng-content>
    `,
    host: {
        class: 'guru-content'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GuruContent { }

@Component({
    selector: 'guru-footer',
    template: `
        <mat-toolbar class="guru-footer-toolbar">
            <ng-content></ng-content>
        </mat-toolbar>
    `,
    host: {
        class: 'guru-footer'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GuruFooter { }
