import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';

type SignaturePadProps = {
  onEnd: (signature: string) => void; // Callback function to handle the end of the signing
};

export const SignaturePad = ({ onEnd }: SignaturePadProps) => {
  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (sigPadRef.current) {
      const signatureImage = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      onEnd(signatureImage);
    }
  };

  return (
    <SignatureCanvas
      ref={sigPadRef}
      penColor="black"
      canvasProps={{ className: 'signatureCanvas' }}
      onEnd={handleEnd}
    />
  );
};