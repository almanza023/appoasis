import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { GastosRoutingModule } from './gastos-routing.module';
import { GastosComponent } from './gastos.component';


@NgModule({
  declarations: [
    GastosComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    GastosRoutingModule
  ]
})
export class GastosModule { }
