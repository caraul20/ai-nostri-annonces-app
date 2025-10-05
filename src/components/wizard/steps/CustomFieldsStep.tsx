'use client';

import { CustomField, WizardFormData } from '@/types/listing-wizard';
import { AlertCircle, Info } from 'lucide-react';

interface CustomFieldsStepProps {
  customFields: CustomField[];
  formData: WizardFormData;
  onFormDataChange: (updates: Partial<WizardFormData>) => void;
  errors: { [key: string]: string[] };
  categoryName?: string;
  subcategoryName?: string;
}

export default function CustomFieldsStep({ 
  customFields, 
  formData, 
  onFormDataChange, 
  errors,
  categoryName,
  subcategoryName
}: CustomFieldsStepProps) {
  const handleFieldChange = (fieldId: string, value: any) => {
    const currentCustomFields = formData.customFields || {};
    onFormDataChange({
      customFields: {
        ...currentCustomFields,
        [fieldId]: value
      }
    });
  };

  const getFieldValue = (fieldId: string) => {
    return formData.customFields?.[fieldId] || '';
  };

  const renderField = (field: CustomField) => {
    const value = getFieldValue(field.id);
    const hasError = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Selectează...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const isSelected = Array.isArray(value) ? value.includes(option.value) : false;
              return (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleFieldChange(field.id, [...currentValues, option.value]);
                      } else {
                        handleFieldChange(field.id, currentValues.filter(v => v !== option.value));
                      }
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              Da
            </label>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      default:
        return null;
    }
  };

  if (customFields.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 rounded-xl p-8">
          <Info className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Gata să continui!
          </h3>
          <p className="text-green-700">
            Această categorie nu necesită informații suplimentare. Poți trece la următorul pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Detalii specifice pentru {subcategoryName}
        </h2>
        <p className="text-gray-600 text-lg">
          Completează informațiile specifice care îi vor ajuta pe cumpărători să înțeleagă mai bine produsul tău
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          {customFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {errors[field.id] && (
                <div className="mt-1">
                  {errors[field.id].map((error, index) => (
                    <p key={index} className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
              
              {field.validation && (
                <p className="mt-1 text-sm text-gray-500">
                  {field.validation.min && field.validation.max && (
                    `Între ${field.validation.min} și ${field.validation.max}`
                  )}
                  {field.validation.message && (
                    field.validation.message
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">ℹ️ De ce sunt importante aceste informații?</h3>
        <p className="text-sm text-blue-800">
          Aceste detalii specifice îi ajută pe cumpărători să înțeleagă exact ce cumpără și să ia o decizie informată. 
          Cu cât completezi mai multe informații, cu atât mai multe șanse ai să îți vinzi produsul rapid.
        </p>
      </div>
    </div>
  );
}
