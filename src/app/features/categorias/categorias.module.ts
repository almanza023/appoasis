import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';

import { CategoriasComponent } from './categorias.component';
import { CategoriasRoutingModule } from './categorias-routing.module';




@NgModule({
  declarations: [
    CategoriasComponent
  ],
  imports: [
    CommonModule,
    ComponentModule,
    CategoriasRoutingModule
  ]
})
export class CategoriasModule { }
