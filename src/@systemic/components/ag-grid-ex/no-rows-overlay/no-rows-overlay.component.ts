// ============================================
// Author						: Prabakaran
// Description					:
// Date							:
// ============================================
import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayComp } from 'ag-grid-community';

@Component({
    selector: 'ag-no-rows-overlay',
    templateUrl: 'no-rows-overlay.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp {
    constructor() {
    }
    agInit(params): void {
    }
}