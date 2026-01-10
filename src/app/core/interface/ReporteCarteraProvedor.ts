import { Cartera } from "./Cartera";

export interface ReporteCarteraProvedor {
  nombre?: string;
  numerodocumento?: string;
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
