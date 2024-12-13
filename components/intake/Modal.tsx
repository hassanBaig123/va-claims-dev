type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCancel?: () => void; // Optional, in case you want a separate handler for cancel
    children: React.ReactNode;
  };
  
  export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
  
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {children}
                <div className="modal-actions">
                    <button onClick={onClose}>Ok</button>
                </div>
            </div>
        </div>
    );
};