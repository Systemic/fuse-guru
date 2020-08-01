import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { AgGridExOptions } from '@systemic/components';

@Component({
    selector: 'sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
    public agSampleOption: GridOptions;
    rowData: any;

    columnDefs = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            suppressMenu: true,
        },
        { headerName: 'make', field: 'make', sortable: true, filter: true, },
        { headerName: 'model', field: 'model', sortable: true, filter: true },
        { headerName: 'price', field: 'price', sortable: true, filter: true },
        { headerName: 'make1', field: 'make', sortable: true, filter: true },
        { headerName: 'model1', field: 'model', sortable: true, filter: true },
        { headerName: 'price1', field: 'price', sortable: true, filter: true },
        { headerName: 'make2', field: 'make', sortable: true, filter: true },
        { headerName: 'model2', field: 'model', sortable: true, filter: true },
        { headerName: 'price2', field: 'price', sortable: true, filter: true },
        { headerName: 'make3', field: 'make', sortable: true, filter: true },
        { headerName: 'model3', field: 'model', sortable: true, filter: true },
        { headerName: 'price3', field: 'price', sortable: true, filter: true },
        { headerName: 'make4', field: 'make', sortable: true, filter: true },
        { headerName: 'model4', field: 'model', sortable: true, filter: true },
        { headerName: 'price4', field: 'price', sortable: true, filter: true }

    ];
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private http: HttpClient
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.agSampleOption = { ...AgGridExOptions, ...this.agSampleOption };
    }

    ngOnInit(): void {
        // this.srvApp.getData();
        this.rowData = this.http.get('http://192.168.0.115:4520/assets/sample.json');

        console.log(this.rowData);

    }
}
