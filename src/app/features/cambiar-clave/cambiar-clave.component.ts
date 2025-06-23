import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from 'src/app/core/services/seguridad.service';

@Component({
    selector: 'app-cambiar-clave',
    templateUrl: './cambiar-clave.component.html',
    providers: [MessageService],
})
export class CambiarClaveComponent {
    nombreModulo: string = 'Cambio de Clave de ingreso';
    form: FormGroup;
    username:string;

    constructor(
        private seguridadService: SeguridadService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.username=localStorage.getItem('username')!;
        this.form = this.fb.group({
            nuevaclave: ['', Validators.required],
            confirmacion: ['', Validators.required],
            usuario_id: ['', Validators.required],
        });
    }

    crear(item: any) {
        this.seguridadService
            .cambioClave(item)
            .pipe(finalize(() => this.reinicarFormulario()))
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
                        detail: error.error.message,
                        life: 3000,
                    });
                }
            );
    }
    reinicarFormulario() {
        this.form.reset();
    }

    onSubmit() {
        let userId=localStorage.getItem('user_id')!;
        this.form.get('usuario_id').setValue(userId);
        if (this.form.valid) {
          if(this.form.get('nuevaclave').value!=this.form.get('confirmacion').value){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Las contraseñas no coinciden.',
                life: 3000,
            });
            return;
          }else{
            this.crear(this.form.value)
          }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar todos los campos que son obligatorios',
                life: 3000,
            });
            return;
        }
    }
}
