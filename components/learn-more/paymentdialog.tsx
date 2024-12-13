import React, { useState } from 'react';
import { Dialog, DialogOverlay, DialogContent } from '@radix-ui/react-dialog';
import StripePaymentForm from '@/components/learn-more/StripePaymentForm';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: string | null;
  selectedProductId: string | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onOpenChange, selectedProduct, selectedProductId }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccessfulPayment = (paymentMethodId: string) => {
    setPaymentSuccess(true);
    //onOpenChange(false); // Optionally close the dialog or keep it open
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay>
        <DialogContent>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
            <div className="min-h-screen px-4 text-center">
              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {paymentSuccess ? (
                  <div>
                    <h2 className="text-xl font-medium leading-6 text-gray-900">Payment Successful</h2>
                    <p className="mt-1 text-sm text-gray-500">Your payment was successful! Please check your email to complete registration.</p>
                    <button type="button" onClick={() => onOpenChange(false)} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-medium leading-6 text-gray-900">Complete Your Purchase</h2>
                    <p className="mt-1 text-sm text-gray-500">You are purchasing the {selectedProduct} plan.</p>
                    <StripePaymentForm onSuccessfulPayment={handleSuccessfulPayment} selectedProductId={selectedProductId} />
                    <button type="button" onClick={() => onOpenChange(false)} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default PaymentDialog;