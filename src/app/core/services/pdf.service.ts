
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacturaData } from '../interface/FacturaData';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  generateInvoicePDF(data: FacturaData): void {
    const doc = new jsPDF();
    let y = 15;

    // Título
    doc.setFontSize(16);
    doc.text('Remisión N° ' + data.venta.id, 20, y);
    y += 2;

    // Información de la Factura
    doc.setFontSize(12);
    // Información de la Factura en formato tabla
    autoTable(doc, {
      startY: y,
      head: [['', '']],
      body: [
        ['Fecha: ' + new Date(data.venta.created_at).toLocaleDateString(), 'Hora: ' + new Date(data.venta.created_at).toLocaleTimeString()]
      ],
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      margin: { left: 20 },
      styles: { fontSize: 10 }
    });
    y = (doc as any).lastAutoTable.finalY + 5;

    // Datos del Cliente
    // Datos del Cliente en dos filas
    autoTable(doc, {
      startY: y,
      head: [['Información del Cliente', '', '', '']],
      body: [
        ['Nombre', data.cliente.nombre || '', 'Dirección', data.cliente.direccion || ''],
        ['Número Documento', data.cliente.numerodocumento || '', 'Teléfono', data.cliente.telefono || ''],
        ['Ciudad', data.cliente.ciudad || '', '', '']
      ],
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      margin: { left: 20 },
      styles: { fontSize: 10 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Tabla de productos con autoTable (mejor formato)
    autoTable(doc, {
      startY: y,
      head: [['Producto', 'Cant.', 'Precio', 'Subtotal']],
      body: data.detalles.map(item => [
        item.producto.nombre,
        item.total_cantidad,
        `$${item.precio.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `$${item.total_subtotal.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
      ]),
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Total Neto
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: $${data.venta.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      190,
      y,
      { align: 'right' }
    );

    // Descargar PDF
    doc.save(`remision_${data.venta.id}.pdf`);
  }


cierreCajaPDF(data:any){
    const doc = new jsPDF();
    let y = 20;

      // Header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalle de Caja', 10, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`N° de Apertura de Caja: ${data.caja_id}`, 10, y);
      y += 7;
      doc.text(`Fecha Inicio: ${data.fecha_inicio}`, 10, y);

      y += 5;
      // Table 1: Concepto/Valor
      autoTable(doc, {
        startY: y,
        head: [['Concepto', 'Valor']],
        body: [
          ['Base Inicial', `$${data.base_inicial.toLocaleString('es-CO', {minimumFractionDigits: 2})}`],
          ['Total Ventas', `$${data.totalventas.toLocaleString('es-CO', {minimumFractionDigits: 2})}`],
          ['Total Gastos', `$${data.totalgastos.toLocaleString('es-CO', {minimumFractionDigits: 2})}`],
          ['Total Neto', `$${data.totalneto.toLocaleString('es-CO', {minimumFractionDigits: 2})}`],
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 10 }
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      // Table 3: Forma de Pago/Valor
      const paymentRows = data.ventasPorTipo.map((p: any) => [p.nombre, `$${p.total.toLocaleString('es-CO', {minimumFractionDigits: 2})}`]);
      paymentRows.push(['Total', `$${data.totalneto.toLocaleString('es-CO', {minimumFractionDigits: 2})}`]);

      autoTable(doc, {
        startY: y,
        head: [['Forma de Pago', 'Valor']],
        body: paymentRows,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 10 }
      });

      // Save PDF
      doc.save(`cierre_caja_${data.caja_id}.pdf`);
    }








}
