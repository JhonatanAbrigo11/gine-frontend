import React, { useState, useEffect } from 'react'
import { Plus, Pill, Trash2, Edit2, Search, Save, X, AlertCircle } from 'lucide-react'
import { Button } from '@/widgets/button'

interface Medicine {
  id: string
  genericName: string
  brandNames: string[]
  presentations: string[]
  concentrations: string[]
  defaultDose: string | null
  defaultFrequency: string | null
  defaultDuration: string | null
  defaultRoute: string | null
}

export function ClinicalMedicinesSectionEditor() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [genericName, setGenericName] = useState('')
  const [brandNamesInput, setBrandNamesInput] = useState('')
  const [presentationsInput, setPresentationsInput] = useState('')
  const [concentrationsInput, setConcentrationsInput] = useState('')
  const [defaultDose, setDefaultDose] = useState('')
  const [defaultFrequency, setDefaultFrequency] = useState('')
  const [defaultDuration, setDefaultDuration] = useState('')
  const [defaultRoute, setDefaultRoute] = useState('')

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3001/api/medicines')
      if (!res.ok) throw new Error('Error al cargar la lista de medicamentos')
      const data = await res.json()
      setMedicines(data)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError('No se pudo conectar con el servidor clínico. Verifique que el backend esté en ejecución.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  const openAddForm = () => {
    setEditingId(null)
    setGenericName('')
    setBrandNamesInput('')
    setPresentationsInput('')
    setConcentrationsInput('')
    setDefaultDose('')
    setDefaultFrequency('')
    setDefaultDuration('')
    setDefaultRoute('Oral')
    setIsFormOpen(true)
  }

  const openEditForm = (med: Medicine) => {
    setEditingId(med.id)
    setGenericName(med.genericName)
    setBrandNamesInput(med.brandNames.join(', '))
    setPresentationsInput(med.presentations.join(', '))
    setConcentrationsInput(med.concentrations.join(', '))
    setDefaultDose(med.defaultDose || '')
    setDefaultFrequency(med.defaultFrequency || '')
    setDefaultDuration(med.defaultDuration || '')
    setDefaultRoute(med.defaultRoute || 'Oral')
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!genericName.trim()) {
      alert('El nombre genérico (DCI) es obligatorio.')
      return
    }

    const brandNames = brandNamesInput
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0)

    const presentations = presentationsInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)

    const concentrations = concentrationsInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)

    const payload = {
      genericName: genericName.trim(),
      brandNames,
      presentations,
      concentrations,
      defaultDose: defaultDose.trim() || null,
      defaultFrequency: defaultFrequency.trim() || null,
      defaultDuration: defaultDuration.trim() || null,
      defaultRoute: defaultRoute.trim() || null
    }

    try {
      let res
      if (editingId) {
        // PUT
        res = await fetch(`http://localhost:3001/api/medicines/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // POST
        res = await fetch('http://localhost:3001/api/medicines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Error al guardar el medicamento')
      }

      setIsFormOpen(false)
      fetchMedicines()
    } catch (err: any) {
      alert(err.message || 'Error al guardar el medicamento')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Está seguro que desea eliminar "${name}" del Vademécum?`)) {
      return
    }

    try {
      const res = await fetch(`http://localhost:3001/api/medicines/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Error al eliminar el medicamento')
      fetchMedicines()
    } catch (err: any) {
      alert(err.message || 'Error al eliminar')
    }
  }

  const filteredMedicines = medicines.filter(med =>
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.brandNames.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Error de Conexión</h4>
            <p className="text-xs font-semibold text-rose-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Control Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-clinical-50/50 p-4 rounded-2xl border border-clinical-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-clinical-400" />
          <input
            type="text"
            placeholder="Buscar por DCI (Genérico) o Nombre Comercial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-clinical-150 text-xs font-bold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
          />
        </div>
        <Button
          onClick={openAddForm}
          variant="primary"
          className="h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary-200 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Agregar Medicamento
        </Button>
      </div>

      {/* Medicines Form Overlay Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-clinical-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-clinical-100 shadow-premium w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-clinical-50/50 border-b border-clinical-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-sm">
                  <Pill className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-clinical-900 uppercase tracking-wider">
                    {editingId ? 'Editar Medicamento' : 'Nuevo Medicamento en Vademécum'}
                  </h3>
                  <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">
                    Formulario Clínico de Farmacia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 rounded-lg bg-clinical-100/55 hover:bg-rose-50 hover:text-rose-600 text-clinical-500 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Nombre Genérico (DCI) */}
                <div className="md:col-span-2">
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Medicamento Genérico (DCI) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Paracetamol, Ibuprofeno, Progesterona"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>

                {/* 2. Nombres Comerciales */}
                <div className="md:col-span-2">
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Nombres Comerciales (Separados por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Termofin, Umbral, Tempra (Uno o más)"
                    value={brandNamesInput}
                    onChange={(e) => setBrandNamesInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                  <span className="text-[8px] font-bold text-clinical-400 mt-1 block">Ingrese una lista de marcas recomendadas para el paciente.</span>
                </div>

                {/* 3. Presentaciones */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Presentaciones (Separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Tableta, Cápsula blanda, Suspensión"
                    value={presentationsInput}
                    onChange={(e) => setPresentationsInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>

                {/* 4. Concentraciones */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Concentraciones (Separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 500 mg, 1 g, 200 mg"
                    value={concentrationsInput}
                    onChange={(e) => setConcentrationsInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>

                {/* 5. Vía de Administración */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Vía de Administración por Defecto
                  </label>
                  <select
                    value={defaultRoute}
                    onChange={(e) => setDefaultRoute(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  >
                    <option>Oral</option>
                    <option>Vaginal</option>
                    <option>Intramuscular</option>
                    <option>Intravenosa</option>
                    <option>Subcutánea</option>
                    <option>Tópica</option>
                    <option>Oftálmica</option>
                  </select>
                </div>

                {/* 6. Dosis por Defecto */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Dosis por Defecto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1 tableta, 1 óvulo"
                    value={defaultDose}
                    onChange={(e) => setDefaultDose(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>

                {/* 7. Frecuencia por Defecto */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Frecuencia por Defecto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Cada 8 horas, Cada 24 horas"
                    value={defaultFrequency}
                    onChange={(e) => setDefaultFrequency(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>

                {/* 8. Duración por Defecto */}
                <div>
                  <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                    Duración por Defecto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 3 días, 5 días, 14 días"
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-clinical-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  variant="secondary"
                  className="h-10 px-4 rounded-xl border-clinical-200 text-clinical-600 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-clinical-50 transition-all"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary-200"
                >
                  <Save className="h-4 w-4 mr-2" /> {editingId ? 'Actualizar' : 'Guardar en Vademécum'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Medicines Cards */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-clinical-450 tracking-wider uppercase">Cargando Vademécum...</span>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-clinical-150 rounded-2xl bg-white">
          <Pill className="h-12 w-12 text-clinical-300 mx-auto mb-3" />
          <h4 className="font-bold text-sm text-clinical-900">No se encontraron medicamentos</h4>
          <p className="text-xs text-clinical-400 mt-1 max-w-sm mx-auto">
            Use el botón de arriba para registrar medicamentos nuevos o limpie su búsqueda actual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl border border-clinical-100 hover:border-primary-100 hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-clinical-50/50 bg-clinical-50/10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Pill className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-clinical-900 tracking-tight leading-tight">
                      {med.genericName}
                    </h4>
                    <span className="text-[8px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5 block">
                      Medicamento DCI
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(med)}
                    className="h-8 w-8 rounded-lg text-clinical-500 hover:bg-clinical-50 hover:text-primary-600 flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id, med.genericName)}
                    className="h-8 w-8 rounded-lg text-clinical-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-4 text-xs font-semibold text-clinical-700">
                {/* Brand Names (Multiple commercial names!) */}
                <div>
                  <span className="text-[9px] font-bold text-clinical-400 block uppercase tracking-wider mb-1.5">
                    Nombres Comerciales
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {med.brandNames.length > 0 ? (
                      med.brandNames.map((brand, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[10px] font-bold text-indigo-600"
                        >
                          {brand}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-clinical-400 italic">Genérico puro</span>
                    )}
                  </div>
                </div>

                {/* Configurations parameters */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-clinical-50/30">
                  <div>
                    <span className="text-[8px] font-bold text-clinical-400 block uppercase tracking-widest">
                      Presentaciones
                    </span>
                    <span className="text-[10px] font-bold text-clinical-850 mt-0.5 block truncate">
                      {med.presentations.join(', ') || 'No configurada'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-clinical-400 block uppercase tracking-widest">
                      Concentraciones
                    </span>
                    <span className="text-[10px] font-bold text-clinical-850 mt-0.5 block truncate">
                      {med.concentrations.join(', ') || 'No configurada'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-clinical-400 block uppercase tracking-widest">
                      Dosis Sugerida
                    </span>
                    <span className="text-[10px] font-bold text-clinical-850 mt-0.5 block truncate">
                      {med.defaultDose || 'No configurada'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-clinical-400 block uppercase tracking-widest">
                      Vía Sugerida
                    </span>
                    <span className="text-[10px] font-bold text-clinical-850 mt-0.5 block truncate">
                      {med.defaultRoute || 'Oral'}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[8px] font-bold text-clinical-400 block uppercase tracking-widest">
                      Frecuencia y Duración
                    </span>
                    <span className="text-[10px] font-bold text-clinical-850 mt-0.5 block truncate">
                      {med.defaultFrequency || 'No configurada'}{med.defaultDuration ? ` • ${med.defaultDuration}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
