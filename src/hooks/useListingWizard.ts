'use client';

import { useState, useCallback, useMemo } from 'react';
import { WizardState, WizardStep, WizardFormData, CATEGORY_CONFIG } from '@/types/listing-wizard';

export function useListingWizard() {
  const INITIAL_STEPS: WizardStep[] = useMemo(() => [
    {
      id: 'category',
      title: 'Categoria',
      description: 'Alege categoria principală',
      isCompleted: false,
      isActive: true
    },
    {
      id: 'subcategory',
      title: 'Subcategoria',
      description: 'Alege subcategoria',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'details',
      title: 'Detalii de bază',
      description: 'Titlu, descriere, preț, locație',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'custom-fields',
      title: 'Detalii specifice',
      description: 'Informații specifice categoriei',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'images',
      title: 'Fotografii',
      description: 'Adaugă până la 5 fotografii',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'review',
      title: 'Verificare',
      description: 'Verifică și publică anunțul',
      isCompleted: false,
      isActive: false
    }
  ], []);

  const [state, setState] = useState<WizardState>(() => ({
    currentStep: 0,
    steps: INITIAL_STEPS,
    formData: {},
    isLoading: false,
    errors: {}
  }));

  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
      errors: {} // Clear errors when form data changes
    }));
  }, []);

  const setErrors = useCallback((errors: { [key: string]: string[] }) => {
    setState(prev => ({ ...prev, errors }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setState(prev => {
      const newSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === stepIndex,
        isCompleted: index < stepIndex
      }));

      return {
        ...prev,
        currentStep: stepIndex,
        steps: newSteps
      };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      const nextStepIndex = Math.min(prev.currentStep + 1, prev.steps.length - 1);
      
      const newSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === nextStepIndex,
        isCompleted: index < nextStepIndex
      }));

      return {
        ...prev,
        currentStep: nextStepIndex,
        steps: newSteps
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => {
      const prevStepIndex = Math.max(prev.currentStep - 1, 0);
      
      const newSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === prevStepIndex,
        isCompleted: index < prevStepIndex
      }));

      return {
        ...prev,
        currentStep: prevStepIndex,
        steps: newSteps
      };
    });
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    const { currentStep, formData } = state;
    const errors: { [key: string]: string[] } = {};

    switch (currentStep) {
      case 0: // Category
        if (!formData.categoryId) {
          errors.categoryId = ['Selectează o categorie'];
        }
        break;

      case 1: // Subcategory
        if (!formData.subcategoryId) {
          errors.subcategoryId = ['Selectează o subcategorie'];
        }
        break;

      case 2: // Basic details
        if (!formData.title || formData.title.length < 5) {
          errors.title = ['Titlul trebuie să aibă cel puțin 5 caractere'];
        }
        if (!formData.description || formData.description.length < 20) {
          errors.description = ['Descrierea trebuie să aibă cel puțin 20 de caractere'];
        }
        if (!formData.price || formData.price <= 0) {
          errors.price = ['Prețul trebuie să fie mai mare decât 0'];
        }
        if (!formData.locationId) {
          errors.locationId = ['Selectează o locație'];
        }
        if (!formData.phone || formData.phone.length < 10) {
          errors.phone = ['Introdu un număr de telefon valid (minim 10 cifre)'];
        }
        break;

      case 3: // Custom fields
        const category = CATEGORY_CONFIG.find(c => c.id === formData.categoryId);
        const subcategory = category?.subcategories.find(s => s.id === formData.subcategoryId);
        
        if (subcategory) {
          subcategory.customFields.forEach(field => {
            if (field.required) {
              const value = formData.customFields?.[field.id];
              if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[field.id] = [`${field.label} este obligatoriu`];
              }
            }
          });
        }
        break;

      case 4: // Images
        // Images are optional, so no validation needed
        break;

      case 5: // Review
        // Final validation happens here
        break;
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    return true;
  }, [state.currentStep, state.formData, setErrors]);

  // Compute validation result without causing re-renders
  const isCurrentStepValid = (() => {
    const { currentStep, formData } = state;
    
    switch (currentStep) {
      case 0:
        return !!formData.categoryId;
      case 1:
        return !!formData.subcategoryId;
      case 2:
        return !!(formData.title && formData.title.length >= 5 &&
                 formData.description && formData.description.length >= 20 &&
                 formData.price && formData.price > 0 &&
                 formData.locationId &&
                 formData.phone && formData.phone.length >= 10);
      case 3:
        const category = CATEGORY_CONFIG.find(c => c.id === formData.categoryId);
        const subcategory = category?.subcategories.find(s => s.id === formData.subcategoryId);
        if (!subcategory) return true;
        
        return subcategory.customFields.every(field => {
          if (!field.required) return true;
          const value = formData.customFields?.[field.id];
          return value && (typeof value !== 'string' || value.trim() !== '');
        });
      case 4:
        return true; // Images are optional
      case 5:
        return true; // Review step
      default:
        return false;
    }
  })();

  const canGoNext = isCurrentStepValid;
  const canGoPrev = state.currentStep > 0;

  const getSelectedCategory = useCallback(() => {
    if (!state.formData.categoryId) return null;
    return CATEGORY_CONFIG.find(c => c.id === state.formData.categoryId) || null;
  }, [state.formData.categoryId]);

  const getSelectedSubcategory = useCallback(() => {
    if (!state.formData.categoryId || !state.formData.subcategoryId) return null;
    const category = CATEGORY_CONFIG.find(c => c.id === state.formData.categoryId);
    if (!category) return null;
    return category.subcategories.find(s => s.id === state.formData.subcategoryId) || null;
  }, [state.formData.categoryId, state.formData.subcategoryId]);

  const getCustomFields = useCallback(() => {
    if (!state.formData.categoryId || !state.formData.subcategoryId) return [];
    const category = CATEGORY_CONFIG.find(c => c.id === state.formData.categoryId);
    const subcategory = category?.subcategories.find(s => s.id === state.formData.subcategoryId);
    return subcategory?.customFields || [];
  }, [state.formData.categoryId, state.formData.subcategoryId]);

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      steps: INITIAL_STEPS,
      formData: {},
      isLoading: false,
      errors: {}
    });
  }, [INITIAL_STEPS]);

  const getCurrentStepData = useCallback(() => {
    return state.steps[state.currentStep];
  }, [state.currentStep, state.steps]);

  return {
    // State
    ...state,
    
    // Actions
    updateFormData,
    setErrors,
    setLoading,
    goToStep,
    nextStep,
    prevStep,
    reset,
    
    // Validation
    validateCurrentStep,
    canGoNext,
    canGoPrev,
    
    // Helpers
    getSelectedCategory,
    getSelectedSubcategory,
    getCustomFields,
    getCurrentStepData,
    
    // Constants
    totalSteps: INITIAL_STEPS.length,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === INITIAL_STEPS.length - 1
  };
}
