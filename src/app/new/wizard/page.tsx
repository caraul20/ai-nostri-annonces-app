'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useListingWizard } from '@/hooks/useListingWizard';
import { createListing } from '@/app/actions/listings';

// Wizard Components
import WizardProgress from '@/components/wizard/WizardProgress';
import WizardNavigation from '@/components/wizard/WizardNavigation';
import CategoryStep from '@/components/wizard/steps/CategoryStep';
import SubcategoryStep from '@/components/wizard/steps/SubcategoryStep';
import BasicDetailsStep from '@/components/wizard/steps/BasicDetailsStep';
import CustomFieldsStep from '@/components/wizard/steps/CustomFieldsStep';
import ImagesStep from '@/components/wizard/steps/ImagesStep';
import ReviewStep from '@/components/wizard/steps/ReviewStep';

export default function NewListingWizardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    currentStep,
    steps,
    formData,
    errors,
    isLoading,
    updateFormData,
    setErrors,
    setLoading,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    isFirstStep,
    isLastStep,
    getSelectedCategory,
    getSelectedSubcategory,
    getCustomFields,
    getCurrentStepData,
    reset
  } = useListingWizard();

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    updateFormData({ 
      categoryId, 
      categoryName,
      // Reset subcategory when category changes
      subcategoryId: undefined,
      subcategoryName: undefined,
      customFields: {}
    });
  };

  const handleSubcategorySelect = (subcategoryId: string, subcategoryName: string) => {
    updateFormData({ 
      subcategoryId, 
      subcategoryName,
      // Reset custom fields when subcategory changes
      customFields: {}
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrors({ _form: ['Trebuie să fii autentificat pentru a publica un anunț.'] });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Debug form data before submission
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form data:', formData);
      console.log('Phone in form data:', formData.phone);
      console.log('User ID:', user.id);

      // Prepare form data for submission
      const submissionData = new FormData();
      
      // Basic fields
      submissionData.append('title', formData.title || '');
      submissionData.append('description', formData.description || '');
      submissionData.append('price', (formData.price || 0).toString());
      submissionData.append('categoryId', formData.categoryId || '');
      submissionData.append('locationId', formData.locationId || '');
      submissionData.append('phone', formData.phone || '');
      submissionData.append('userId', user.id);

      // Debug what we're sending
      console.log('Submission data:');
      for (let [key, value] of submissionData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // Images
      submissionData.append('images', JSON.stringify(formData.images || []));
      
      // Custom fields - flatten them into the main form data
      if (formData.customFields) {
        Object.entries(formData.customFields).forEach(([key, value]) => {
          submissionData.append(`custom_${key}`, 
            typeof value === 'object' ? JSON.stringify(value) : String(value)
          );
        });
      }

      // Submit the listing
      const result = await createListing({}, submissionData);
      
      if (result.errors) {
        setErrors(result.errors);
      }
      // If successful, createListing will redirect automatically
      
    } catch (error) {
      console.error('Error submitting listing:', error);
      setErrors({ _form: ['A apărut o eroare neașteptată. Te rog să încerci din nou.'] });
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Category
        return (
          <CategoryStep
            selectedCategoryId={formData.categoryId}
            onCategorySelect={handleCategorySelect}
            errors={errors.categoryId}
          />
        );

      case 1: // Subcategory
        const selectedCategory = getSelectedCategory();
        if (!selectedCategory) {
          goToStep(0);
          return null;
        }
        return (
          <SubcategoryStep
            category={selectedCategory}
            selectedSubcategoryId={formData.subcategoryId}
            onSubcategorySelect={handleSubcategorySelect}
            onBackToCategory={() => goToStep(0)}
            errors={errors.subcategoryId}
          />
        );

      case 2: // Basic Details
        return (
          <BasicDetailsStep
            formData={formData}
            onFormDataChange={updateFormData}
            errors={errors}
          />
        );

      case 3: // Custom Fields
        const customFields = getCustomFields();
        return (
          <CustomFieldsStep
            customFields={customFields}
            formData={formData}
            onFormDataChange={updateFormData}
            errors={errors}
            categoryName={formData.categoryName}
            subcategoryName={formData.subcategoryName}
          />
        );

      case 4: // Images
        return (
          <ImagesStep
            formData={formData}
            onFormDataChange={updateFormData}
            errors={errors}
          />
        );

      case 5: // Review
        return (
          <ReviewStep
            formData={formData}
            onEdit={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Progress Header */}
        <WizardProgress
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Main Content */}
        <div className="pb-24"> {/* Space for fixed navigation */}
          <div className="container mx-auto px-4 py-8">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation Footer */}
        <WizardNavigation
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          currentStepTitle={getCurrentStepData()?.title}
        />

        {/* Exit Modal - TODO: Add confirmation modal when user tries to leave */}
      </div>
    </ProtectedRoute>
  );
}
