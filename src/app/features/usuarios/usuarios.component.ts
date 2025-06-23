import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from 'src/app/core/interface/Usuario';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    providers: [MessageService],
})
export class UsuariosComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    persona: any = {};
    barrio: any = {};
    tipo: any = {};

    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    editar: boolean = false;
    usuario: Usuario = {};

    nombreModulo: string = 'Módulo de Usuarios';
    roles: any[] = [];
    rol: any = {};

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDataAll();
        this.cols = [];
        this.statuses = [];
        this.roles = [
            { id: 1, descripcion: 'ADMINISTRADOR' },
            { id: 2, descripcion: 'VENDEDOR' },
        ];
    }

    getDataAll() {
        this.usuarioService.getAll().subscribe(
            (response) => {
                //console.log(response.data);
                this.data = response.data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: error.error.data,
                    life: 3000,
                });
            }
        );
    }

    openNew() {
        this.persona = {};
        this.persona.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
        this.editar = false;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(item: any) {
        //console.log(item)
        this.persona = { ...item };
        this.clienteDialog = true;
        this.persona.editar = true;
        this.editar = true;
        this.filtrar(this.persona.rol);
    }

    bloqueoCliente(cliente: any) {
        this.deleteProductDialog = true;
        this.persona = { ...cliente };
        this.usuario.nombre = this.persona.nombre;
        this.usuario.username = this.persona.username;
        this.usuario.password = this.persona.password;
        this.usuario.rol = this.persona.rol;
        this.usuario.estado = !this.persona.estado;
        this.persona.cambio_estado = true;
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.usuarioService
            .putData(this.persona.id, this.usuario)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: response.message,
                        life: 3000,
                    });
                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: error.error.data,
                        life: 3000,
                    });
                }
            );
        this.persona = {};
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        this.persona.user = localStorage.getItem('user_id');
        if (this.persona.nombre == undefined || this.persona.nombre == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        if (this.persona.username == undefined && this.persona.username == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Usuario',
                life: 3000,
            });
            return;
        }

        if (this.persona.rol == undefined && this.persona.rol == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar un rol',
                life: 3000,
            });
            return;
        }

        if (this.editar == false) {
            if (this.persona.password == undefined) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Debe ingresar una Clave',
                    life: 3000,
                });
                return;
            }
        }
        this.usuario.nombre = this.persona.nombre;
        this.usuario.username = this.persona.username;
        this.usuario.password = this.persona.password;
        this.usuario.rol = this.persona.rol;
        if (this.editar == false) {
            this.crear(this.usuario);
        } else {
            this.actualizar(this.persona.id, this.usuario);
        }
        this.clienteDialog = false;
        this.persona = {};
        this.usuario = {};
        this.seleccionado = {};
    }

    crear(item: Usuario) {
        this.usuarioService
            .postData(item)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                    }
                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: response.message,
                        life: 3000,
                    });
                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: error.error.data,
                        life: 3000,
                    });
                }
            );
    }

    actualizar(id: number, item: Usuario) {
        this.usuarioService
            .putData(id, item)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                    }
                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: response.message,
                        life: 3000,
                    });
                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: error.error.data,
                        life: 3000,
                    });
                }
            );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onChange(event) {
        this.persona.rol = event.value.id;
    }

    filtrar(valor: any) {
        if (valor) {
            this.rol = this.roles.find((objeto) => objeto['id'] === valor);
        }
    }
}
