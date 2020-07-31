import { Component, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'ag-temp-renderer',
    template: `
        <ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>
    `,
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        style: `flex-direction: row;
                box-sizing: border-box;
                display: flex;
                place-content: center;
                align-items: center;`
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgTempRendererComponent implements ICellRendererAngularComp {
    template: TemplateRef<any>;
    templateContext: { $implicit: any; params: any };
    constructor() { }

    refresh(params: any): boolean {
        this.templateContext = {
            $implicit: params.data,
            params: params
        };
        return true;
    }

    agInit(params: ICellRendererParams): void {
        this.template = params['Template'];
        this.refresh(params);
    }
}
