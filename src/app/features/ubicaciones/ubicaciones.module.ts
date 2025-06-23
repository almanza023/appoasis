import { UbicacionesRoutingModule } from './ubicaciones-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';
import { UbicacionesComponent } from './ubicaciones.component';


@NgModule({
  declarations: [
    UbicacionesComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    UbicacionesRoutingModule
  ]
})
export class UbicacionesModule { }
