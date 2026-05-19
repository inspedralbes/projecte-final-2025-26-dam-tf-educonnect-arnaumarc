import React, { useEffect, useMemo, useState } from 'react';

type Preset = { id: string; url: string };

interface CourseCoverEditorModalProps {
  open: boolean;
  onClose: () => void;
  apiBaseUrl: string;
  courseId: string;
  professorId: string;
  currentImage?: string;
  onUpdated: (course: any) => void;
}

export const CourseCoverEditorModal: React.FC<CourseCoverEditorModalProps> = ({
  open,
  onClose,
  apiBaseUrl,
  courseId,
  professorId,
  currentImage,
  onUpdated
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPreview = useMemo(() => {
    const preset = presets.find(p => p.id === selectedPresetId);
    return preset?.url || currentImage || '';
  }, [presets, selectedPresetId, currentImage]);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setSelectedPresetId(null);
    setUploadFile(null);

    setLoadingPresets(true);
    fetch(`${apiBaseUrl}/api/course-covers/presets`)
      .then(r => r.json())
      .then(data => {
        setPresets(Array.isArray(data?.presets) ? data.presets : []);
      })
      .catch(err => {
        console.error('Error fetching cover presets:', err);
        setPresets([]);
      })
      .finally(() => setLoadingPresets(false));
  }, [open, apiBaseUrl]);

  const savePreset = async () => {
    if (!selectedPresetId) {
      setError('Selecciona una portada predeterminada.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/courses/${courseId}/cover/preset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professorId, presetId: selectedPresetId })
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'No se pudo actualizar la portada');

      onUpdated(data.course);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error actualizando portada');
    } finally {
      setSaving(false);
    }
  };

  const saveUpload = async () => {
    if (!uploadFile) {
      setError('Selecciona un archivo de imagen para subir.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('cover', uploadFile);
      form.append('professorId', professorId);

      const res = await fetch(`${apiBaseUrl}/api/courses/${courseId}/cover/upload`, {
        method: 'PUT',
        body: form
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'No se pudo subir la portada');

      onUpdated(data.course);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error subiendo portada');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Cambiar portada</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Elige una predeterminada o sube una imagen.</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors font-semibold"
            disabled={saving}
          >
            Cerrar
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {currentPreview && (
            <div className="h-40 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800">
              <img src={currentPreview} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white">Predeterminadas</h3>
            {loadingPresets ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando…</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setSelectedPresetId(p.id);
                    }}
                    className={`relative h-20 rounded-xl overflow-hidden border transition-all ${
                      selectedPresetId === p.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-blue-400'
                    }`}
                    title={p.id}
                  >
                    <img src={p.url} alt={p.id} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={savePreset}
                disabled={saving || !selectedPresetId}
                className="px-5 py-3 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                {saving ? 'Guardando…' : 'Usar predeterminada'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white">Subir archivo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                setSelectedPresetId(null);
                setUploadFile(e.target.files?.[0] || null);
              }}
              className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-zinc-800 dark:file:text-gray-200 dark:hover:file:bg-zinc-700"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={saveUpload}
                disabled={saving || !uploadFile}
                className="px-5 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
              >
                {saving ? 'Subiendo…' : 'Subir portada'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200 text-sm font-semibold">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
