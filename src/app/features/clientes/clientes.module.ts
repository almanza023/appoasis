import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';

import { ClientesComponent } from './clientes.component';
import { ClientesRoutingModule } from './clientes-routing.module';


@NgModule({
  declarations: [
    ClientesComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    ClientesRoutingModule
  ]
})
export class ClienteModule { }
