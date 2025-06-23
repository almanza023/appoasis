import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';


import { EmpresasComponent } from './empresas.component';
import { EmpresasRoutingModule } from './empresas-routing.module';




@NgModule({
  declarations: [
    EmpresasComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    EmpresasRoutingModule
  ]
})
export class EmpresaModule { }
