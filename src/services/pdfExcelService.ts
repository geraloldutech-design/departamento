import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Activity, ActivityReport, Inspection, Employee, Sector } from '../types';

export const PdfExcelService = {
  exportActivityToPDF(activity: Activity, report?: ActivityReport, inspection?: Inspection): void {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 135, 90); // EMRICH Green
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)', 14, 12);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('RELATÓRIO TÉCNICO OPERACIONAL - BEIRA, MOÇAMBIQUE', 14, 20);

    // Title & Activity details
    doc.setTextColor(15, 23, 42); // Navy
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Actividade #${activity.id}: ${activity.title}`, 14, 38);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let y = 46;
    doc.text(`Sector: ${activity.sectorName}`, 14, y);
    doc.text(`Departamento: ${activity.department}`, 110, y);
    y += 6;
    doc.text(`Local: ${activity.locationName}`, 14, y);
    doc.text(`Data/Hora: ${activity.date} às ${activity.time}`, 110, y);
    y += 6;
    doc.text(`Responsável: ${activity.responsibleName} (${activity.responsibleWhatsapp})`, 14, y);
    doc.text(`Prioridade: ${activity.priority} | Estado: ${activity.status}`, 110, y);
    y += 6;
    doc.text(`Progresso: ${activity.progressPercent}%`, 14, y);

    // Divider
    y += 8;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, y, 196, y);

    // Description
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Descrição das Operações:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(activity.description, 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 4;

    // Materials & Equipment
    if (activity.materialsRequired.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Materiais & Equipamentos Utilizados:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Materiais: ${activity.materialsRequired.join(', ')}`, 14, y);
      y += 5;
      doc.text(`Equipamentos: ${activity.equipmentRequired.join(', ')}`, 14, y);
      y += 8;
    }

    // Checklist Status
    if (activity.checklist && activity.checklist.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Checklist de Execução:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      activity.checklist.forEach(chk => {
        const checkMark = chk.completed ? '[X]' : '[ ]';
        doc.text(`${checkMark} ${chk.text}`, 18, y);
        y += 5;
      });
      y += 4;
    }

    // Field Report details if available
    if (report) {
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo do Relatório do Chefe de Sector:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Horário de Execução: ${report.startTime} - ${report.endTime}`, 14, y);
      y += 5;
      doc.text(`Ocorrências/Problemas: ${report.problemsEncountered || 'Nenhum problema registado.'}`, 14, y);
      y += 5;
      if (report.digitalSignature) {
        doc.setFont('helvetica', 'italic');
        doc.text(`Assinatura Digital: ${report.digitalSignature}`, 14, y);
        y += 6;
      }
    }

    // Inspection details if available
    if (inspection) {
      y += 4;
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 32, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('PARECER TÉCNICO DA FISCALIZAÇÃO', 18, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Inspector: ${inspection.inspectorName} | Data: ${inspection.inspectionDate}`, 18, y + 14);
      doc.text(`Decisão: ${inspection.decision.toUpperCase()}`, 18, y + 20);
      const textOpinion = doc.splitTextToSize(inspection.technicalOpinion, 170);
      doc.text(textOpinion, 18, y + 25);
      y += 36;
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Gerado por EMRICH GESTOR em ${new Date().toLocaleString('pt-MZ')} | Documento Oficial EMRICH`, 14, 285);

    doc.save(`EMRICH_Relatorio_Actividade_${activity.id}.pdf`);
  },

  exportActivitiesToExcel(activities: Activity[]): void {
    const data = activities.map(act => ({
      ID: act.id,
      Título: act.title,
      Sector: act.sectorName,
      Departamento: act.department,
      Responsável: act.responsibleName,
      WhatsApp: act.responsibleWhatsapp,
      Local: act.locationName,
      Data: act.date,
      Hora: act.time,
      Prioridade: act.priority,
      Estado: act.status,
      'Progresso (%)': act.progressPercent,
      'Materiais Requeridos': act.materialsRequired.join('; '),
      'Notificado WhatsApp': act.whatsappNotified ? 'Sim' : 'Não'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades_EMRICH');

    XLSX.writeFile(workbook, `EMRICH_Actividades_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportEmployeesToExcel(employees: Employee[]): void {
    const data = employees.map(emp => ({
      ID: emp.id,
      Nome: emp.name,
      BI: emp.biNumber,
      Cargo: emp.cargo,
      Sector: emp.sectorName,
      Departamento: emp.department,
      WhatsApp: emp.whatsapp,
      Email: emp.email,
      Estado: emp.status,
      'Data de Admissão': emp.admissionDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionarios_EMRICH');

    XLSX.writeFile(workbook, `EMRICH_Funcionarios_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportPeriodicReportPDF(period: string, activities: Activity[], sectors: Sector[]): void {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42); // Navy Blue
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)', 14, 14);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`RELATÓRIO DE DESEMPENHO OPERACIONAL (${period.toUpperCase()})`, 14, 22);

    doc.setTextColor(15, 23, 42);
    let y = 40;

    const total = activities.length;
    const completed = activities.filter(a => a.status === 'Concluída').length;
    const inProgress = activities.filter(a => a.status === 'Em Andamento').length;
    const delayed = activities.filter(a => a.status === 'Atrasada').length;
    const pending = activities.filter(a => a.status === 'Pendente').length;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Resumo Executivo das Actividades', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total de Actividades Registadas: ${total}`, 18, y); y += 6;
    doc.text(`• Actividades Concluídas: ${completed} (${total > 0 ? Math.round((completed/total)*100) : 0}%)`, 18, y); y += 6;
    doc.text(`• Actividades Em Andamento: ${inProgress}`, 18, y); y += 6;
    doc.text(`• Actividades Atrasadas / Com Impedimento: ${delayed}`, 18, y); y += 6;
    doc.text(`• Actividades Pendentes: ${pending}`, 18, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Desempenho por Sector', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Sector', 14, y);
    doc.text('Chefe Responsável', 65, y);
    doc.text('Membros', 130, y);
    doc.text('Estado', 170, y);
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    sectors.forEach(sec => {
      doc.text(sec.name, 14, y);
      doc.text(sec.headName, 65, y);
      doc.text(`${sec.memberCount} func.`, 130, y);
      doc.text(sec.status, 170, y);
      y += 6;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Parecer da Direção Municipal', 14, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const textOpinion = doc.splitTextToSize(
      'O cumprimento do plano operacional no Rio Chiveve mantém níveis satisfatórios. Recomenda-se atenção especial ao canal do Chota e reforço do abastecimento de insumos para o sector de Canalização.',
      180
    );
    doc.text(textOpinion, 14, y);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Relatório Gerado por EMRICH GESTOR - ${new Date().toLocaleString('pt-MZ')}`, 14, 285);

    doc.save(`EMRICH_Relatorio_${period.replace(/\s+/g, '_')}.pdf`);
  }
};
