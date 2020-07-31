import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { SampleComponent } from './sample.component';

import { GuruCardModule, GuruAgGridModule } from '@systemic/components';

const routes = [
    {
        path: 'sample',
        component: SampleComponent
    }
];

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,

        GuruCardModule,
        GuruAgGridModule
    ],
    exports: [
        SampleComponent
    ]
})

export class SampleModule {
}
