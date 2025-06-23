export interface AperturaCaja {
    id?: number;
    user_id?: string,
    bodega_id?: string,
	monto_inicial?: string ,
	monto_final?: string ,
	fecha?: Date ,
	fecha_cierre?: Date ,
	descripcion?: string ,
	totalventas?: number ,
	totalgastos?: number ,
	utilidad?: number ,
	estado?: boolean

}
