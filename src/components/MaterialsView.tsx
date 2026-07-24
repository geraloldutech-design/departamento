import React, { useState } from 'react';
import { MaterialItem, MaterialRequisition, UserRole, Sector } from '../types';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Building2,
  Check,
  X
} from 'lucide-react';

interface MaterialsViewProps {
  materials: MaterialItem[];
  requisitions: MaterialRequisition[];
  sectors: Sector[];
  activeRole: UserRole;
  currentUserName: string;
  onSaveMaterial: (mat: MaterialItem) => void;
  onRequestMaterial: (req: MaterialRequisition) => void;
  onValidateRequisition: (reqId: string) => void;
  onApproveRequisition: (reqId: string) => void; // also decrements stock automatically
  onRejectRequisition: (reqId: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  requisitions,
  sectors,
  activeRole,
  currentUserName,
  onSaveMaterial,
  onRequestMaterial,
  onValidateRequisition,
  onApproveRequisition,
  onRejectRequisition
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'requisitions' | 'consumption'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  // New Material Form
  const [newMatCode, setNewMatCode] = useState(`MAT-${Math.floor(100 + Math.random() * 900)}`);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<MaterialItem['category']>('Construção');
  const [newMatQty, setNewMatQty] = useState(100);
  const [newMatUnit, setNewMatUnit] = useState<MaterialItem['unit']>('unidades');
  const [newMatMinQty, setNewMatMinQty] = useState(20);
  const [newMatPrice, setNewMatPrice] = useState(500);
  const [newMatLocation, setNewMatLocation] = useState('Armazém Central EMRICH');

  // Requisition Form
  const [reqSectorName, setReqSectorName] = useState(sectors[0]?.name || 'Limpeza');
  const [reqPurpose, setReqPurpose] = useState('');
  const [selectedMatId, setSelectedMatId] = useState(materials[0]?.id || '');
  const [reqQty, setReqQty] = useState(10);

  const lowStockCount = materials.filter(m => m.quantity <= m.minQuantity).length;

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'Todos' || m.category === categoryFilter;
    const matchesLowStock = !showLowStockOnly || m.quantity <= m.minQuantity;
    return matchesSearch && matchesCat && matchesLowStock;
  });

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    const newMat: MaterialItem = {
      id: `mat-${Date.now()}`,
      code: newMatCode,
      name: newMatName,
      category: newMatCategory,
      quantity: Number(newMatQty),
      unit: newMatUnit,
      minQuantity: Number(newMatMinQty),
      unitPriceEstimate: Number(newMatPrice),
      warehouseLocation: newMatLocation,
      lastRestockedAt: new Date().toISOString().split('T')[0]
    };

    onSaveMaterial(newMat);
    setIsAddModalOpen(false);
    setNewMatName('');
  };

  const handleCreateRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = materials.find(m => m.id === selectedMatId);
    if (!mat || !reqPurpose.trim()) return;

    const sectorObj = sectors.find(s => s.name === reqSectorName);

    const newReq: MaterialRequisition = {
      id: `req-${Date.now()}`,
      requisitionNumber: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      sectorId: sectorObj?.id || 'sec-1',
      sectorName: reqSectorName,
      requestedBy: currentUserName,
      requestedByRole: activeRole,
      items: [
        {
          materialId: mat.id,
          materialName: mat.name,
          quantityRequested: Number(reqQty),
          unit: mat.unit
        }
      ],
      purpose: reqPurpose,
      status: 'Pendente (Solicitado)',
      createdAt: new Date().toISOString()
    };

    onRequestMaterial(newReq);
    setIsReqModalOpen(false);
    setReqPurpose('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Materiais e Armazém</h1>
            <p className="text-sm text-slate-500">Controlo de stock, alertas de escassez e fluxo hierárquico de requisições</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsReqModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium text-sm shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Fazer Requisição</span>
          </button>

          {(activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registar Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Aviso de Stock Baixo</p>
              <p className="text-xs text-amber-700">Existem {lowStockCount} materiais com quantidade igual ou abaixo do nível mínimo recomendado.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('stock');
              setShowLowStockOnly(!showLowStockOnly);
            }}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition"
          >
            {showLowStockOnly ? 'Ver Todos' : 'Filtrar Críticos'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-3 text-sm font-medium border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'stock'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventário de Stock ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requisitions')}
          className={`pb-3 text-sm font-medium border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'requisitions'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Requisições & Aprovações ({requisitions.length})</span>
        </button>
      </div>

      {/* TAB 1: STOCK INVENTORY */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Todos">Todas Categorias</option>
                <option value="Construção">Construção</option>
                <option value="Canalização">Canalização</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Limpeza & EPIS">Limpeza & EPIS</option>
                <option value="Jardinagem">Jardinagem</option>
                <option value="Ferramentas Consumíveis">Ferramentas Consumíveis</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                    <th className="p-4">Código / Nome</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Stock Actual</th>
                    <th className="p-4">Stock Mínimo</th>
                    <th className="p-4">Preço Est. (MZN)</th>
                    <th className="p-4">Localização Armazém</th>
                    <th className="p-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredMaterials.map(m => {
                    const isLow = m.quantity <= m.minQuantity;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{m.code}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          {m.quantity} <span className="text-xs font-normal text-slate-500">{m.unit}</span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {m.minQuantity} {m.unit}
                        </td>
                        <td className="p-4 text-slate-700 font-mono text-xs">
                          {m.unitPriceEstimate.toLocaleString('pt-MZ')} MZN
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {m.warehouseLocation}
                        </td>
                        <td className="p-4 text-right">
                          {isLow ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-medium border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Stock Baixo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                              <CheckCircle className="w-3 h-3" />
                              <span>Adequado</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUISITIONS & WORKFLOW */}
      {activeTab === 'requisitions' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">Fluxo de Validação Hierárquica da EMRICH:</p>
              <p>1. Solicitado por Funcionário/Chefe Sector → 2. Validado por Chefe de Departamento → 3. Aprovação Final por Administrador/Director (Baixa automática no Stock)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {requisitions.map(req => {
              const canValidate = (activeRole === 'Chefe de Departamento' || activeRole === 'Director' || activeRole === 'Administrador') && 
                                  req.status === 'Pendente (Solicitado)';
              const canApprove = (activeRole === 'Administrador' || activeRole === 'Director') && 
                                 (req.status === 'Validado pelo Chefe' || req.status === 'Pendente (Solicitado)');

              return (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                          {req.requisitionNumber}
                        </span>
                        <span className="text-sm font-bold text-slate-800">{req.sectorName}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Solicitado por <strong className="text-slate-700">{req.requestedBy}</strong> ({req.requestedByRole}) em {new Date(req.createdAt).toLocaleString('pt-MZ')}</p>
                    </div>

                    <div>
                      {req.status === 'Aprovado (Stock Entregue)' ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{req.status}</span>
                        </span>
                      ) : req.status === 'Validado pelo Chefe' ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{req.status}</span>
                        </span>
                      ) : req.status === 'Rejeitado' ? (
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold">
                          {req.status}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400 font-medium uppercase mb-1">Itens Requisitados:</p>
                      <ul className="space-y-1">
                        {req.items.map((it, idx) => (
                          <li key={idx} className="font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between">
                            <span>{it.materialName}</span>
                            <span className="text-emerald-700">{it.quantityRequested} {it.unit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-slate-400 font-medium uppercase mb-1">Finalidade / Motivo:</p>
                      <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{req.purpose}"
                      </p>
                      {req.activityTitle && (
                        <p className="text-xs text-slate-500 mt-1">Actividade: {req.activityTitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Authorized Roles */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                    {canValidate && (
                      <button
                        onClick={() => onValidateRequisition(req.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Validar (Chefe Dept)</span>
                      </button>
                    )}

                    {canApprove && (
                      <button
                        onClick={() => onApproveRequisition(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar & Baixar do Stock</span>
                      </button>
                    )}

                    {(canValidate || canApprove) && (
                      <button
                        onClick={() => onRejectRequisition(req.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium hover:bg-rose-100 transition flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rejeitar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MATERIAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registar Novo Material no Stock</h3>
            <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Código</label>
                  <input
                    type="text"
                    value={newMatCode}
                    onChange={e => setNewMatCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Categoria</label>
                  <select
                    value={newMatCategory}
                    onChange={e => setNewMatCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Construção">Construção</option>
                    <option value="Canalização">Canalização</option>
                    <option value="Elétrico">Elétrico</option>
                    <option value="Limpeza & EPIS">Limpeza & EPIS</option>
                    <option value="Jardinagem">Jardinagem</option>
                    <option value="Ferramentas Consumíveis">Ferramentas Consumíveis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nome do Material</label>
                <input
                  type="text"
                  placeholder="Ex: Cimento Portland 42.5N 50kg"
                  value={newMatName}
                  onChange={e => setNewMatName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Qtd Inicial</label>
                  <input
                    type="number"
                    value={newMatQty}
                    onChange={e => setNewMatQty(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unidade</label>
                  <select
                    value={newMatUnit}
                    onChange={e => setNewMatUnit(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="unidades">Unidades</option>
                    <option value="sacos">Sacos</option>
                    <option value="metros">Metros</option>
                    <option value="litros">Litros</option>
                    <option value="kg">KG</option>
                    <option value="caixas">Caixas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mín. Alerta</label>
                  <input
                    type="number"
                    value={newMatMinQty}
                    onChange={e => setNewMatMinQty(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Preço Unitário Estimado (MZN)</label>
                <input
                  type="number"
                  value={newMatPrice}
                  onChange={e => setNewMatPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Localização no Armazém</label>
                <input
                  type="text"
                  value={newMatLocation}
                  onChange={e => setNewMatLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Salvar no Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE REQUISITION */}
      {isReqModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Nova Requisição de Materiais</h3>
            <form onSubmit={handleCreateRequisitionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Sector Solicitante</label>
                <select
                  value={reqSectorName}
                  onChange={e => setReqSectorName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Material do Stock</label>
                <select
                  value={selectedMatId}
                  onChange={e => setSelectedMatId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.quantity} {m.unit} disponíveis)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantidade Solicitada</label>
                <input
                  type="number"
                  value={reqQty}
                  onChange={e => setReqQty(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Finalidade / Aplicação da Obra</label>
                <textarea
                  rows={3}
                  placeholder="Descreva onde e porquê este material será utilizado..."
                  value={reqPurpose}
                  onChange={e => setReqPurpose(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                >
                  Submeter Requisição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
