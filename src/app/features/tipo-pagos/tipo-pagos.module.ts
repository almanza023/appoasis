import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';

import { TipoPagosComponent } from './tipo-pagos.component';
import { TipoPagoRoutingModule } from './tipo-pagos-routing.module';




@NgModule({
  declarations: [
    TipoPagosComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    TipoPagoRoutingModule
  ]
})
export class TipoPagoModule { }
