import { NoRowsOverlayComponent } from './no-rows-overlay/no-rows-overlay.component';
import { GridOptions } from 'ag-grid-community';

export const AgGridExOptions: GridOptions = {
    frameworkComponents: {
        customNoRowsOverlay: NoRowsOverlayComponent
    },
    noRowsOverlayComponent: 'customNoRowsOverlay',
    defaultColDef: {
        menuTabs: ['generalMenuTab', 'filterMenuTab'],
        sortable: true,
        resizable: false,
        filter: 'agTextColumnFilter'
    },
    suppressRowClickSelection: true,
    suppressMovableColumns: true,
    suppressDragLeaveHidesColumns: true,
    enableColResize: false,
    // headerHeight: 30,
    gridAutoHeight: false,
    // rowHeight: 30,
    rowSelection: 'multiple'
};
