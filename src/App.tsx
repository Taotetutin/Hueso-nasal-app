import React, { useState } from 'react';
import { Calculator, AlertCircle, Activity, Ruler } from 'lucide-react';

interface CalculationResults {
  nasalBonePercentile: number;
  lpnLhnRatio: number;
  dbpLhnRatio: number;
}

function App() {
  const [formData, setFormData] = useState({
    gaWeeks: '',
    gaDays: '',
    lhn: '',
    lpn: '',
    dbp: '',
  });
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const percentileTable: { [key: number]: number[] } = {
    20: [2.84, 3.65, 5.60, 7.57, 8.38],
    21: [3.02, 3.86, 5.88, 7.92, 8.75],
    22: [3.21, 4.07, 6.15, 8.26, 9.12],
    23: [3.39, 4.28, 6.43, 8.60, 9.49],
  };

  const validateInput = () => {
    const newErrors: string[] = [];
    const { gaWeeks, gaDays, lhn, lpn, dbp } = formData;

    if (!gaWeeks || parseInt(gaWeeks) < 20 || parseInt(gaWeeks) > 23) {
      newErrors.push('La edad gestacional debe estar entre 20 y 23 semanas');
    }
    if (!gaDays || parseInt(gaDays) < 0 || parseInt(gaDays) > 6) {
      newErrors.push('Los días deben estar entre 0 y 6');
    }
    if (!lhn || parseFloat(lhn) <= 0) {
      newErrors.push('La longitud del hueso nasal debe ser mayor a 0');
    }
    if (!lpn || parseFloat(lpn) <= 0) {
      newErrors.push('La longitud prenasal debe ser mayor a 0');
    }
    if (!dbp || parseFloat(dbp) <= 0) {
      newErrors.push('El diámetro biparietal debe ser mayor a 0');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const calculatePercentile = (gaWeeks: number, lhn: number) => {
    const weekPercentiles = percentileTable[gaWeeks];
    for (let i = 0; i < weekPercentiles.length; i++) {
      if (lhn <= weekPercentiles[i]) {
        return [1, 5, 50, 95, 99][i];
      }
    }
    return 99;
  };

  const handleCalculate = () => {
    if (!validateInput()) return;

    const lhnValue = parseFloat(formData.lhn);
    const lpnValue = parseFloat(formData.lpn);
    const dbpValue = parseFloat(formData.dbp);
    const gaWeeks = parseInt(formData.gaWeeks);

    const nasalBonePercentile = calculatePercentile(gaWeeks, lhnValue);
    const lpnLhnRatio = lpnValue / lhnValue;
    const dbpLhnRatio = dbpValue / lhnValue;

    setResults({
      nasalBonePercentile,
      lpnLhnRatio,
      dbpLhnRatio,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex items-center justify-center space-x-2">
            <Ruler className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Hueso Nasal Verdadero</h1>
          </div>
          <p className="text-indigo-200 text-center mt-2">Calculadora de mediciones fetales</p>
        </div>

        <div className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Por favor corrige los siguientes errores:</span>
              </div>
              <ul className="list-disc ml-5 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Edad gestacional (semanas)
              </label>
              <input
                type="number"
                name="gaWeeks"
                min="20"
                max="23"
                value={formData.gaWeeks}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Días
              </label>
              <input
                type="number"
                name="gaDays"
                min="0"
                max="6"
                value={formData.gaDays}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {['lhn', 'lpn', 'dbp'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field === 'lhn' ? 'Longitud de hueso nasal (LHN)' :
                 field === 'lpn' ? 'Longitud prenasal (LPN)' :
                 'Diámetro biparietal (DBP)'} (mm)
              </label>
              <input
                type="number"
                name={field}
                step="0.01"
                value={formData[field as keyof typeof formData]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}

          <button
            onClick={handleCalculate}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Calcular</span>
          </button>

          {results && (
            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Resultados</span>
              </h2>
              
              <div className="space-y-3">
                <ResultItem
                  label="Percentil del hueso nasal"
                  value={`${results.nasalBonePercentile.toFixed(2)}`}
                  isNormal={results.nasalBonePercentile > 2.5}
                />
                <ResultItem
                  label="Relación LPN/LHN"
                  value={`${results.lpnLhnRatio.toFixed(2)}`}
                  isNormal={results.lpnLhnRatio > 0.8}
                />
                <ResultItem
                  label="Relación DBP/LHN"
                  value={`${results.dbpLhnRatio.toFixed(2)}`}
                  isNormal={results.dbpLhnRatio > 11}
                />
              </div>
            </div>
          )}
        </div>

        <footer className="bg-gray-50 py-4 text-center text-sm text-gray-600 border-t">
          Todos los derechos reservados a MiMaternoFetal.cl
        </footer>
      </div>
    </div>
  );
}

interface ResultItemProps {
  label: string;
  value: string;
  isNormal: boolean;
}

function ResultItem({ label, value, isNormal }: ResultItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
      <span className="text-gray-700">{label}:</span>
      <span className={`font-medium ${isNormal ? 'text-green-600' : 'text-red-600'}`}>
        {value} ({isNormal ? 'Normal' : 'Anormal'})
      </span>
    </div>
  );
}

export default App;