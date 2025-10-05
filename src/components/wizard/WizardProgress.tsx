'use client';

import { WizardStep } from '@/types/listing-wizard';
import { Check, ChevronRight } from 'lucide-react';

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export default function WizardProgress({ steps, currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Progress Bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pasul {currentStep + 1} din {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gray-900 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-gray-900">{steps[currentStep]?.title}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
          </div>
        </div>

        {/* Desktop Step Navigation */}
        <div className="hidden md:block">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-6">
              {steps.map((step, stepIndex) => (
                <li key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => onStepClick?.(stepIndex)}
                    disabled={stepIndex > currentStep}
                    className={`
                      relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200
                      ${step.isCompleted 
                        ? 'bg-gray-900 border-gray-900 text-white' 
                        : step.isActive 
                        ? 'bg-white border-gray-900 text-gray-900' 
                        : 'bg-white border-gray-300 text-gray-400'
                      }
                      ${stepIndex <= currentStep ? 'cursor-pointer hover:shadow-sm' : 'cursor-not-allowed'}
                    `}
                  >
                    {step.isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{stepIndex + 1}</span>
                    )}
                  </button>

                  {/* Step Label */}
                  <div className="ml-3 min-w-0 flex-1">
                    <p className={`text-sm font-medium ${
                      step.isActive ? 'text-gray-900' : 
                      step.isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>

                  {/* Separator */}
                  {stepIndex < steps.length - 1 && (
                    <div className="h-px w-8 bg-gray-200 ml-4" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}
