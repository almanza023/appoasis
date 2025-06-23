import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { VentasComponent } from './ventas.component';
import { RegistroVentasComponent } from './registro-ventas/registro-ventas.component';
import { VentasRoutingModule } from './ventas-routing.module';
import { ClienteModule } from '../clientes/clientes.module';


@NgModule({
  declarations: [
    VentasComponent,
    RegistroVentasComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
