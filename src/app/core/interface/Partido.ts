export interface Partido {
    id?: number;
    equipo_a?: number;
    equipo_b?: number;
    fecha?: string;
    hora?: string;
    lugar?: string;
    tipoPartidoId?: number;
    jornada?: number;
    estado?: boolean;
}
