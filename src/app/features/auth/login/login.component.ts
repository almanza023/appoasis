import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [MessageService],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    usuario!: string;
    clave!: string;
    loading: boolean = false;

    constructor(
        private router: Router,
        public layoutService: LayoutService,
        private seguridadService: SeguridadService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.limpiarLocalstore();
    }

    login() {
        this.limpiarLocalstore();
        if (this.usuario === undefined || this.usuario == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar un Usuario',
                life: 3500,
            });
            return;
        }

        if (this.clave === undefined || this.clave == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar una Contraseña',
                life: 3500,
            });
            return;
        }
        let datos = {
            username: this.usuario,
            password: this.clave,
        };
        this.loading = true;
        setTimeout(() => {
            this.seguridadService.postLogin(datos).subscribe(
                (response) => {
                    if(response.data=="Error de autenticación"){
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Advertencia',
                            detail: 'Credenciales Incorrectas o no tiene permiso para ingresar al aplicativo',
                            life: 3800,
                        });
                        return;
                    }
                    //console.log(response);
                    localStorage.setItem('token', response.data.acces_token);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('rol', response.data.rol);
                    localStorage.setItem('user_id', response.data.user_id);
                    this.router.navigate(['/dashboard']);
                },
                (error) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Advertencia',
                        detail: 'Credenciales Incorrectas o no tiene permiso para ingresar al aplicativo',
                        life: 3800,
                    });
                }
            );
        }, 2500);
    }

    limpiarLocalstore() {
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        localStorage.removeItem('rol');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
    }
}
