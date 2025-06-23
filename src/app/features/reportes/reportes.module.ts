import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '../../shared/components/component.module';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReporteDiaComponent } from './reporte-dia/reporte-dia.component';
import { ReporteDiaHistoricosComponent } from './reporte-dia-historicos/reporte-dia-historicos.component';
import { ReporteCajaMenorComponent } from './reporte-caja-menor/reporte-caja-menor.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentModule,
        ReactiveFormsModule,
        ReportesRoutingModule
    ],
    declarations: [
    ReporteDiaComponent,
    ReporteDiaHistoricosComponent,
    ReporteCajaMenorComponent
  ]
})
export class ReportesModule { }
