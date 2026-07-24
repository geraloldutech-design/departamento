import React, { useRef, useState } from 'react';
import { DigitalApprovalDocument, UserRole } from '../types';
import { 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  PenTool, 
  ShieldCheck, 
  Clock, 
  User, 
  Hash,
  Award
} from 'lucide-react';

interface DigitalApprovalsViewProps {
  approvals: DigitalApprovalDocument[];
  activeRole: UserRole;
  currentUserName: string;
  onSignApproval: (approvalId: string, level: 1 | 2 | 3, signatureCanvasData: string, comments?: string) => void;
  onRejectApproval: (approvalId: string, comments?: string) => void;
}

export const DigitalApprovalsView: React.FC<DigitalApprovalsViewProps> = ({
  approvals,
  activeRole,
  currentUserName,
  onSignApproval,
  onRejectApproval
}) => {
  const [selectedApproval, setSelectedApproval] = useState<DigitalApprovalDocument | null>(null);
  const [comments, setComments] = useState('');
  
  // Canvas Ref for Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSign = () => {
    if (!selectedApproval) return;
    const canvas = canvasRef.current;
    const signatureData = canvas ? canvas.toDataURL() : 'Signature-Token-Approved';

    onSignApproval(selectedApproval.id, selectedApproval.currentLevel, signatureData, comments);
    setSelectedApproval(null);
    setComments('');
    setHasDrawn(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Aprovação Digital & Assinatura Eletrónica</h1>
            <p className="text-sm text-slate-500">Validação hierárquica de Ordens de Serviço, Requisições e Relatórios em 3 Níveis</p>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="grid grid-cols-1 gap-4">
        {approvals.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                    {app.documentType}
                  </span>
                  <span className="font-mono text-xs text-slate-500">Ref: {app.referenceId}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mt-2">{app.title}</h3>
                <p className="text-xs text-slate-500">Submetido por <strong className="text-slate-700">{app.createdByName}</strong> ({app.createdByRole}) • {app.sectorName}</p>
              </div>

              <div>
                {app.finalStatus === 'Aprovado Total' ? (
                  <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs flex items-center space-x-1 border border-emerald-300">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Aprovado & Validade Digital</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 font-semibold rounded-full text-xs">
                    Nível {app.currentLevel} em Aprovação
                  </span>
                )}
              </div>
            </div>

            {/* 3-Level Steps Progress */}
            <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {app.steps.map((st, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    st.status === 'Aprovado' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Nível {st.level}: {st.roleRequired}</span>
                    {st.status === 'Aprovado' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <p className="text-slate-600 font-medium">{st.approverName || 'Aguardando Assinatura...'}</p>
                  {st.signedAt && (
                    <p className="text-[10px] text-slate-400 font-mono">{new Date(st.signedAt).toLocaleString('pt-MZ')}</p>
                  )}
                  {st.signatureHash && (
                    <p className="text-[9px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 truncate">
                      Hash: {st.signatureHash}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Button */}
            {app.finalStatus !== 'Aprovado Total' && (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedApproval(app)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Assinar e Validar Digitalmente</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL: DIGITAL SIGNATURE CANVAS */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 text-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Assinatura Eletrónica Digital</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedApproval.title} (Nível {selectedApproval.currentLevel})</p>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Desenhe a sua assinatura abaixo:</label>
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-36 cursor-crosshair bg-white"
                  />
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] rounded font-medium"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Parecer / Observações do Aprovador</label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Parecer técnico ou observação opcional..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center space-x-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Esta assinatura gerará um selo hash SHA256 único assinado por <strong>{currentUserName}</strong> ({activeRole}).</span>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSign}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center space-x-1"
                >
                  <Award className="w-4 h-4" />
                  <span>Confirmar Assinatura</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
