export interface FacturaData {
  venta?: Venta;
  cliente?: Cliente;
  detalles?: DetalleVenta[];
  pagos?: Pago[];
}

export interface Venta {
  id?: number;
  cliente_id?: number;
  user_id?: number;
  caja_id?: number;
  fecha?: string;
  especial?: number;
  forma_venta?: number;
  total?: number;
  cantidad?: number;
  estado?: number;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  cliente?: Cliente;
}

export interface Cliente {
  id?: number;
  nombre?: string;
  numerodocumento?: string;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  nombrenegocio?: string | null;
  estado?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DetalleVenta {
  venta_id?: number;
  producto_id?: number;
  precio?: number;
  descuento?: number | null;
  id?: number;
  total_cantidad?: number;
  total_subtotal?: number;
  producto?: Producto;
}

export interface Producto {
  id?: number;
  nombre?: string;
  precio?: number;
}

export interface Pago {
  id?: number;
  venta_id?: number;
  tipo_pago_id?: number;
  valor?: number;
  fecha?: string;
  estado?: number;
  created_at?: string;
  updated_at?: string;
}
