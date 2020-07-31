import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AgTempRendererComponent } from './button/ag-temp-renderer.component';
import { NoRowsOverlayComponent } from './no-rows-overlay/no-rows-overlay.component';

@NgModule({
    declarations: [AgTempRendererComponent, NoRowsOverlayComponent],
    imports: [CommonModule, AgGridModule.withComponents([AgTempRendererComponent, NoRowsOverlayComponent])],
    exports: [AgGridModule]
})
export class GuruAgGridModule { }


