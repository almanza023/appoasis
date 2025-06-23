import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { CarterasComprasComponent } from './carteras-compras.component';
import { RegistroPagoCompraComponent } from './registro-pago/registro-pago-compra.component';
import { CarterasComprasRoutingModule } from './carteras-routing.module';


@NgModule({
  declarations: [
    CarterasComprasComponent,
    RegistroPagoCompraComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    CarterasComprasRoutingModule,
  ]
})
export class CarterasComprasModule { }
