'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardNavigationProps {
  canGoPrev: boolean;
  canGoNext: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  currentStepTitle?: string;
}

export default function WizardNavigation({
  canGoPrev,
  canGoNext,
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
  currentStepTitle
}: WizardNavigationProps) {
  return (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <div className="flex-1">
            {!isFirstStep && (
              <Button
                onClick={onPrev}
                disabled={!canGoPrev || isSubmitting}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi
              </Button>
            )}
          </div>

          {/* Step Info (Mobile) */}
          <div className="flex-1 text-center md:hidden">
            <p className="text-sm font-medium text-gray-900">
              {currentStepTitle}
            </p>
          </div>

          {/* Next/Submit Button */}
          <div className="flex-1 flex justify-end">
            {isLastStep ? (
              <Button
                onClick={onSubmit}
                disabled={!canGoNext || isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 flex items-center px-8 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Se publică...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Publică anunțul
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onNext}
                disabled={!canGoNext || isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 flex items-center text-white"
              >
                Continuă
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Validation Hint */}
        {!canGoNext && !isSubmitting && (
          <div className="mt-3 text-center">
            <p className="text-sm text-red-600">
              Completează toate câmpurile obligatorii pentru a continua
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
