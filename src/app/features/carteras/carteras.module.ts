import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { CarterasComponent } from './carteras.component';
import { RegistroPagoComponent } from './registro-pago/registro-pago.component';
import { CarterasRoutingModule } from './carteras-routing.module';


@NgModule({
  declarations: [
    CarterasComponent,
    RegistroPagoComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    CarterasRoutingModule,
  ]
})
export class CarterasModule { }
