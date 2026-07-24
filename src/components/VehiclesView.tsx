import React, { useState } from 'react';
import { VehicleItem, FuelLog, VehicleMaintenance, VehicleTrip, UserRole, Sector } from '../types';
import { 
  Truck, 
  Plus, 
  Fuel, 
  Wrench, 
  MapPin, 
  Gauge, 
  Calendar, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle,
  Search
} from 'lucide-react';

interface VehiclesViewProps {
  vehicles: VehicleItem[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveVehicle: (v: VehicleItem) => void;
  onAddFuelLog: (vehicleId: string, log: FuelLog) => void;
  onAddVehicleMaintenance: (vehicleId: string, log: VehicleMaintenance) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  sectors,
  activeRole,
  onSaveVehicle,
  onAddFuelLog,
  onAddVehicleMaintenance
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'fleet' | 'fuel' | 'maintenance'>('fleet');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddVehModalOpen, setIsAddVehModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [selectedVehForFuel, setSelectedVehForFuel] = useState<VehicleItem | null>(null);

  // Form State New Vehicle
  const [plateNumber, setPlateNumber] = useState('MMB-00-00');
  const [makeModel, setMakeModel] = useState('');
  const [type, setType] = useState<VehicleItem['type']>('Camioneta Pick-up');
  const [sectorName, setSectorName] = useState(sectors[0]?.name || 'Fiscalização');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [currentKm, setCurrentKm] = useState(10000);
  const [fuelType, setFuelType] = useState<'Diesel' | 'Gasolina'>('Diesel');

  // Form State Fuel
  const [fuelLiters, setFuelLiters] = useState(50);
  const [fuelCost, setFuelCost] = useState(4750);
  const [kmAtRefuel, setKmAtRefuel] = useState(10050);
  const [receiptCode, setReceiptCode] = useState('POSTO-PETROMOC-001');

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!makeModel.trim()) return;

    const newVeh: VehicleItem = {
      id: `veh-${Date.now()}`,
      plateNumber,
      makeModel,
      type,
      sectorName,
      assignedDriver: assignedDriver || 'Motorista de Serviço',
      currentKm: Number(currentKm),
      fuelType,
      status: 'Operacional',
      nextServiceKm: Number(currentKm) + 5000,
      fuelLogs: [],
      maintenanceLogs: [],
      trips: []
    };

    onSaveVehicle(newVeh);
    setIsAddVehModalOpen(false);
    setMakeModel('');
  };

  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehForFuel) return;

    const newFuel: FuelLog = {
      id: `fuel-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      liters: Number(fuelLiters),
      costTotal: Number(fuelCost),
      kmAtRefuel: Number(kmAtRefuel),
      driverName: selectedVehForFuel.assignedDriver,
      fuelType: selectedVehForFuel.fuelType,
      receiptCode
    };

    onAddFuelLog(selectedVehForFuel.id, newFuel);
    setIsFuelModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Viaturas e Frota EMRICH</h1>
            <p className="text-sm text-slate-500">Controlo de quilometragem, abastecimento de combustível, motoristas e manutenção</p>
          </div>
        </div>

        {(activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento') && (
          <button
            onClick={() => setIsAddVehModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Viatura</span>
          </button>
        )}
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Viaturas Operacionais</p>
            <p className="text-xl font-bold text-slate-900">{vehicles.filter(v => v.status === 'Operacional').length} / {vehicles.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Litros Abastecidos</p>
            <p className="text-xl font-bold text-slate-900">
              {vehicles.reduce((acc, v) => acc + v.fuelLogs.reduce((fa, f) => fa + f.liters, 0), 0)} L
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Próximas Revisões (KM)</p>
            <p className="text-xl font-bold text-slate-900">{vehicles.filter(v => v.currentKm >= v.nextServiceKm - 1000).length} Alerta(s)</p>
          </div>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                  {v.plateNumber}
                </span>
                <p className="font-bold text-slate-900 text-base mt-2">{v.makeModel}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                v.status === 'Operacional' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {v.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tipo & Sector:</span>
                <span className="font-semibold text-slate-800">{v.type} ({v.sectorName})</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Motorista Atribuído:</span>
                <span className="font-semibold text-slate-800">{v.assignedDriver}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Quilometragem Actual:</span>
                <span className="font-mono font-bold text-blue-600">{v.currentKm.toLocaleString()} KM</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Combustível:</span>
                <span className="font-semibold text-slate-800">{v.fuelType}</span>
              </div>

              {/* Fuel History Preview */}
              {v.fuelLogs.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                  <p className="text-[11px] font-semibold text-slate-700">Último Abastecimento:</p>
                  <p className="text-xs text-slate-600">{v.fuelLogs[v.fuelLogs.length - 1].liters}L ({v.fuelLogs[v.fuelLogs.length - 1].costTotal} MZN) em {v.fuelLogs[v.fuelLogs.length - 1].date}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedVehForFuel(v);
                  setKmAtRefuel(v.currentKm + 50);
                  setIsFuelModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>+ Abastecimento</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD VEHICLE */}
      {isAddVehModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cadastrar Nova Viatura</h3>
            <form onSubmit={handleAddVehicleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Matrícula</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Camioneta Pick-up">Camioneta Pick-up</option>
                    <option value="Camião de Lixo">Camião de Lixo</option>
                    <option value="Trator & Reboque">Trator & Reboque</option>
                    <option value="Camião Cisterna">Camião Cisterna</option>
                    <option value="Motociclo">Motociclo</option>
                    <option value="Lancha de Inspecção">Lancha de Inspecção</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Marca & Modelo</label>
                <input
                  type="text"
                  placeholder="Ex: Toyota Hilux 4x4 Double Cab 2.8"
                  value={makeModel}
                  onChange={e => setMakeModel(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sector Alocado</label>
                  <select
                    value={sectorName}
                    onChange={e => setSectorName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Motorista Responsável</label>
                  <input
                    type="text"
                    placeholder="Ex: Insp. Carlos Langa"
                    value={assignedDriver}
                    onChange={e => setAssignedDriver(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Quilometragem Inicial (KM)</label>
                  <input
                    type="number"
                    value={currentKm}
                    onChange={e => setCurrentKm(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Combustível</label>
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Gasolina">Gasolina</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddVehModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Salvar Viatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REFUEL LOG */}
      {isFuelModalOpen && selectedVehForFuel && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Registar Abastecimento</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedVehForFuel.makeModel} ({selectedVehForFuel.plateNumber})</p>

            <form onSubmit={handleFuelSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Litros Abastecidos</label>
                  <input
                    type="number"
                    value={fuelLiters}
                    onChange={e => setFuelLiters(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Valor Total (MZN)</label>
                  <input
                    type="number"
                    value={fuelCost}
                    onChange={e => setFuelCost(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">KM no Abastecimento</label>
                <input
                  type="number"
                  value={kmAtRefuel}
                  onChange={e => setKmAtRefuel(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nº Recibo / Posto</label>
                <input
                  type="text"
                  value={receiptCode}
                  onChange={e => setReceiptCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Gravar Abastecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
