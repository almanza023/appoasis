
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReporteDiaComponent } from './reporte-dia/reporte-dia.component';
import { ReporteDiaHistoricosComponent } from './reporte-dia-historicos/reporte-dia-historicos.component';
import { ReporteCajaMenorComponent } from './reporte-caja-menor/reporte-caja-menor.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dia/:id', component: ReporteDiaComponent },
        { path: 'historicos', component: ReporteDiaHistoricosComponent },
        { path: 'caja-menor', component: ReporteCajaMenorComponent },
    ])],
    exports: [RouterModule]
})
export class ReportesRoutingModule { }
