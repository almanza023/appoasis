import { Cartera } from "./Cartera";

export interface ReporteCarteraCliente {
  nombre?: string;
  numerodocumento?: string;
  telefono?: string;
  ciudad?: string;
  pagos?: Pago[];
  abonos?: number;
  saldo?: number;
  total?: number;
  facturas?: Factura[];

}


export interface Pago {
  fecha?: string;
  tipopago?: string;
  valor?: number;
}


export interface Factura {
  id?: string;
  fecha?: string;
  total?: number;
}
