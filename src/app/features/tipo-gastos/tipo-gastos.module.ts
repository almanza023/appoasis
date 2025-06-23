import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';



import { TipoGastosComponent } from './tipo-gastos.component';
import { TipoGastoRoutingModule } from './tipo-gastos-routing.module';




@NgModule({
  declarations: [
    TipoGastosComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    TipoGastoRoutingModule
  ]
})
export class TipoGastoModule { }
