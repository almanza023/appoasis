import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ToastModule } from 'primeng/toast';
import {  DropdownModule } from 'primeng/dropdown';
import { ComponentModule } from 'src/app/shared/components/component.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        DropdownModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        ToastModule,
        DashboardsRoutingModule,
        ComponentModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
