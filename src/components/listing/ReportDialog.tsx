'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createReport } from '@/server/repo/repoFirebase';

interface ReportDialogProps {
  listingId: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam sau publicitate' },
  { value: 'inappropriate', label: 'Conținut nepotrivit' },
  { value: 'fake', label: 'Anunț fals sau înșelător' },
  { value: 'duplicate', label: 'Anunț duplicat' },
  { value: 'other', label: 'Altele' }
] as const;

export default function ReportDialog({ listingId, isOpen, onClose }: ReportDialogProps) {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !selectedReason) return;

    setIsSubmitting(true);
    try {
      await createReport({
        listingId,
        reporterId: user.id,
        reason: selectedReason as any,
        details: details.trim()
      });
      
      setIsSubmitted(true);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setSelectedReason('');
        setDetails('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setSelectedReason('');
    setDetails('');
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Raportează anunțul
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Închide dialogul"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Raport trimis cu succes
              </h3>
              <p className="text-gray-600">
                Mulțumim pentru raport. Echipa noastră va revizui anunțul în cel mai scurt timp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Te rugăm să selectezi motivul pentru care raportezi acest anunț:
                </p>
                
                <div className="space-y-3">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason.value}
                      className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="text-gray-900">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                  Detalii suplimentare (opțional)
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  placeholder="Descrie pe scurt problema cu acest anunț..."
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {details.length}/500
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason || isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Se trimite...' : 'Trimite raportul'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
