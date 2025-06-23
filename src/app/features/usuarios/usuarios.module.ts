import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/shared/components/component.module';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';


@NgModule({
  declarations: [
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
