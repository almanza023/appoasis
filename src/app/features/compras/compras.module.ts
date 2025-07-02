import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';

import { ComprasComponent } from './compras.component';
import { RegistroComprasComponent } from './registro-compras/registro-compras.component';
import { ComprasRoutingModule } from './compras-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ComprasComponent,
    RegistroComprasComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    ComprasRoutingModule,
    ReactiveFormsModule
  ]
})
export class ComprasModule { }
