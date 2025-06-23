import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { BodegasComponent } from './bodegas.component';
import { BodegasRoutingModule } from './bodegas-routing.module';




@NgModule({
  declarations: [
    BodegasComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    BodegasRoutingModule
  ]
})
export class BodegasModule { }
