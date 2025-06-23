import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({

  imports: [
    FormsModule,ReactiveFormsModule,
    HttpClientModule, BrowserAnimationsModule, InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    MegaMenuModule,
    MenubarModule, TableModule, ButtonModule, ToastModule, ToolbarModule,
    InputTextareaModule, DropdownModule,  InputNumberModule, DialogModule,
    TabViewModule,ToggleButtonModule, ConfirmDialogModule
  ],
  exports: [
    FormsModule,
    HttpClientModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    MegaMenuModule,
    MenubarModule, TableModule, ButtonModule, ToastModule, ToolbarModule,
    InputTextareaModule, DropdownModule,  InputNumberModule, DialogModule,
    TabViewModule,ToggleButtonModule, ConfirmDialogModule

  ],
  declarations: [

  ]
})
export class SharedModule { }

