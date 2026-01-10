
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacturaData } from '../interface/FacturaData';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { ReporteCarteraCliente } from '../interface/ReporteCarteraCliente';
import { ReporteCarteraProvedor } from '../interface/ReporteCarteraProvedor';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  generateInvoicePDF(data: FacturaData): void {
    console.log('Generating PDF for invoice:', data);
    const doc = new jsPDF();
    let y = 15;

    // Encabezado con logo y título
    // Si tienes un logo base64, puedes agregarlo aquí
    // doc.addImage('data:image/png;base64,...', 'PNG', 15, y, 20, 20);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE REMISIÓN', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Remisión N°: ${data.venta.id}`, 15, y);
    doc.text(`Fecha: ${new Date(data.venta.created_at).toLocaleDateString()}   Hora: ${new Date(data.venta.created_at).toLocaleTimeString()}`, 120, y);
    y += 8;

    // Mostrar forma de venta si existe
    let formaVentaTexto = '';
    if (data.venta.forma_venta === 1) {
        formaVentaTexto = 'CONTADO';
    } else if (data.venta.forma_venta === 2) {
        formaVentaTexto = 'CRÉDITO';
    } else {
        formaVentaTexto =  '';
    }
    doc.text(`Forma de Venta: ${formaVentaTexto}`, 15, y);
    y += 8;

    // Información del Cliente
    autoTable(doc, {
        startY: y,
        head: [['Cliente', 'Documento', 'Teléfono', 'Ciudad', 'Dirección']],
        body: [[
            data.cliente.nombre || '',
            data.cliente.numerodocumento || '',
            data.cliente.telefono || '',
            data.cliente.ciudad || '',
            data.cliente.direccion || ''
        ]],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10 },
        margin: { left: 15, right: 15 }
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    // Tabla de productos
    autoTable(doc, {
        startY: y,
        head: [['#', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: data.detalles.map((item, idx) => [
            idx + 1,
            item.producto.nombre,
            item.total_cantidad,
            `$${item.precio.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            `$${item.total_subtotal.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 15, right: 15 }
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    // Resumen de Total
    autoTable(doc, {
        startY: y,
        head: [['Total']],
        body: [[
            `$${data.venta.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        ]],
        theme: 'plain',
        styles: { fontSize: 12, halign: 'right' },
        margin: { left: 130, right: 15 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Información de pago si existe
    // if (data.venta.forma_venta || data.venta.estado) {
    //     doc.setFontSize(11);
    //     doc.setFont('helvetica', 'bold');
    //     doc.text('Información de Pago:', 15, y);
    //     doc.setFont('helvetica', 'normal');
    //     let pagoInfo = '';
    //     if (data.venta.forma_venta) pagoInfo += `Forma de Pago: ${data.venta.forma_pago}   `;
    //     if (data.venta.estado) pagoInfo += `Estado: ${data.venta.estado}`;
    //     doc.text(pagoInfo, 15, y + 6);
    //     y += 12;
    // }

    // Observaciones si existen
    if (data.venta.observaciones) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100);
        doc.text('Observaciones:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        doc.text(data.venta.observaciones, 15, y + 6);
        y += 12;
    }
    doc.setTextColor(0);

    // Pie de página
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Este documento es una remisión generada automáticamente. Para más información consulte el sistema.', 15, 285);

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


reporteCarteraClientPdf(data: ReporteCarteraCliente): void {
    const doc = new jsPDF();
    let y = 15;

    // Encabezado principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Cartera de Cliente', 105, y, { align: 'center' });
    y += 10;

    // Información del Cliente (en bloque)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${data.nombre || ''}`, 20, y);
    doc.text(`Documento: ${data.numerodocumento || ''}`, 120, y);
    y += 7;
    doc.text(`Teléfono: ${data.telefono || ''}`, 20, y);
    doc.text(`Ciudad: ${data.ciudad || ''}`, 120, y);
    y += 10;

    // Resumen financiero destacado
    autoTable(doc, {
        startY: y,
        head: [['Total Deuda', 'Total Abonos', 'Saldo Pendiente']],
        body: [[
            `$${data.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            `$${data.abonos.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            `$${data.saldo.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        ]],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 11, halign: 'center' },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Sección de Facturas
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Facturas Pendientes', 20, y);
    y += 6;

    autoTable(doc, {
        startY: y,
        head: [[' N°', 'Fecha', 'Total', 'Estado']],
        body: data.facturas.map(item => [
            item.id,
            item.fecha,
            `$${item.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Sección de Pagos Realizados
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Pagos Realizados', 20, y);
    y += 6;

    autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Tipo de Pago', 'Valor']],
        body: data.pagos.length
            ? data.pagos.map(item => [
                    item.fecha,
                    item.tipopago,
                    `$${item.valor.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                ])
            : [['-', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Observaciones o resumen final
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text(
        `Este reporte muestra el estado actual de la cartera del cliente. Para más detalles, consulte el sistema.`,
        20,
        y
    );

    // Descargar PDF
    doc.save(`reporte_cartera_cliente_${data.numerodocumento}.pdf`);
  }

  reporteCarteraProveedorPdf(data: ReporteCarteraProvedor): void {
    const doc = new jsPDF();
    let y = 15;

    // Encabezado principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Cartera de Proveedor', 105, y, { align: 'center' });
    y += 10;

    // Información del Proveedor (uno debajo del otro)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${data.nombre || ''}`, 20, y);
    y += 7;
    doc.text(`Documento: ${data.numerodocumento || ''}`, 20, y);
    y += 10;

    // Resumen financiero destacado
    autoTable(doc, {
        startY: y,
        head: [['Total Deuda', 'Total Abonos', 'Saldo Pendiente']],
        body: [[
            `$${data.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            `$${data.abonos.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            `$${data.saldo.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        ]],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 11, halign: 'center' },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

     // Sección de Facturas
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Facturas Pendientes', 20, y);
    y += 6;

    autoTable(doc, {
        startY: y,
        head: [[' N°', 'Fecha', 'Total', 'Estado']],
        body: data.facturas.map(item => [
            item.id,
            item.fecha,
            `$${item.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    // Sección de Pagos Realizados
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Pagos Realizados', 20, y);
    y += 6;

    autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Tipo de Pago', 'Valor']],
        body: data.pagos.length
            ? data.pagos.map(item => [
                    item.fecha,
                    item.tipopago,
                    `$${item.valor.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                ])
            : [['-', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Observaciones o resumen final
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text(
        `Este reporte muestra el estado actual de la cartera del proveedor. Para más detalles, consulte el sistema.`,
        20,
        y
    );

    // Descargar PDF
    doc.save(`reporte_cartera_proveedor_${data.numerodocumento}.pdf`);
  }






}
