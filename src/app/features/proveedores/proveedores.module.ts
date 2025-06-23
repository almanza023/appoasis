import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresRoutingModule } from './proveedores-routing.module';


@NgModule({
  declarations: [
    ProveedoresComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    ProveedoresRoutingModule
  ]
})
export class ProveedorModule { }
