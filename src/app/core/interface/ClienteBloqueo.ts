export interface ClienteBloqueo {
    id?: string;
    empresa?: string;
    nombre?: string;
    nit?: string;
    idremuner?: string;
    fecha_inicio_bloqueo?: string;
    fecha_fin_bloqueo?: string;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
    habilitado?: string;
    usuario_creacion?: string;
    usuario_actualiza?: string;
    cambio_estado?: boolean;
    editar?: boolean;
    buscar?: boolean;

    
}