import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';
import { CambiarClaveRoutingModule } from './cambiar-clave-routing.module';
import { CambiarClaveComponent } from './cambiar-clave.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CambiarClaveComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    ReactiveFormsModule,
    CambiarClaveRoutingModule
  ]
})
export class CambiarClaveModule { }
