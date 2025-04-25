'use client';

import { useState, useEffect } from 'react';

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  // For static export, we need to provide all possible parameter combinations
  return [
    { id: 'QUOTE001' },
    { id: 'QUOTE002' },
    { id: 'QUOTE003' },
  ];
}
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

// Mock data function - in a real app, this would fetch from an API
const fetchQuoteData = (quoteId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: quoteId,
        status: 'draft',
        createdAt: '2025-04-20',
        validUntil: '2025-05-20',
        jobId: 'JOB001',
        discountPercent: 0,
        notes: 'Standard installation included. Additional charges may apply for complex installations.',
        termsAccepted: false
      });
    }, 500);
  });
};

const validationSchema = Yup.object({
  validUntil: Yup.date().required('Valid until date is required'),
  discountPercent: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
  additionalItems: Yup.array().of(
    Yup.object({
      description: Yup.string().required('Description is required'),
      amount: Yup.number().required('Amount is required')
    })
  )
});

export default function EditQuote() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    validUntil: '',
    discountPercent: 0,
    status: 'draft',
    notes: '',
    termsAccepted: false,
    additionalItems: []
  });

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const data: any = await fetchQuoteData(quoteId);
        setInitialValues({
          validUntil: data.validUntil,
          discountPercent: data.discountPercent || 0,
          status: data.status,
          notes: data.notes || '',
          termsAccepted: data.termsAccepted || false,
          additionalItems: data.additionalItems || []
        });
      } catch (error) {
        console.error('Error loading quote data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to update the quote
      console.log('Updating quote:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to quote details
      router.push(`/quotes/${quoteId}`);
    } catch (error) {
      console.error('Error updating quote:', error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading quote data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/quotes/${quoteId}`} className="text-white mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Quote</h1>
      </header>

      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isValid, dirty }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until*
                  </label>
                  <Field 
                    id="validUntil" 
                    name="validUntil" 
                    type="date" 
                    className="input-field" 
                  />
                  <ErrorMessage name="validUntil" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status*
                  </label>
                  <Field 
                    as="select"
                    id="status" 
                    name="status" 
                    className="input-field" 
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <Field 
                  id="discountPercent" 
                  name="discountPercent" 
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="input-field" 
                />
                <ErrorMessage name="discountPercent" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Field 
                  id="notes" 
                  name="notes" 
                  as="textarea"
                  rows="3"
                  className="input-field" 
                  placeholder="Any additional notes or terms for this quote"
                />
                <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-navy-900 mb-3">Additional Items</h3>
                
                <FieldArray name="additionalItems">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {values.additionalItems.length > 0 ? (
                        values.additionalItems.map((_, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="flex-grow">
                              <Field
                                name={`additionalItems.${index}.description`}
                                placeholder="Description"
                                className="input-field"
                              />
                              <ErrorMessage
                                name={`additionalItems.${index}.description`}
                                component="div"
                                className="mt-1 text-xs text-red-600"
                              />
                            </div>
                            <div className="w-24">
                              <Field
                                name={`additionalItems.${index}.amount`}
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                className="input-field"
                              />
                              <ErrorMessage
                                name={`additionalItems.${index}.amount`}
                                component="div"
                                className="mt-1 text-xs text-red-600"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 p-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-gray-500">No additional items</div>
                      )}

                      <button
                        type="button"
                        onClick={() => push({ description: '', amount: 0 })}
                        className="btn-secondary text-sm py-1 px-2 flex items-center"
                      >
                        <FaPlus className="mr-1" /> Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex items-center">
                <Field 
                  id="termsAccepted" 
                  name="termsAccepted" 
                  type="checkbox" 
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded" 
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                  Terms and conditions accepted by customer
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={!(isValid && dirty) || isSubmitting}
                  className={`btn-primary w-full flex justify-center items-center ${
                    !(isValid && dirty) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
