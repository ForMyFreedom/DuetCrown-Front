import React from 'react';

type ConfirmationModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <form>
        <h2 className='centralized-text'>
            Tem certeza? Irá perder suas mudanças locais caso não tenha sido salvas
        </h2>
        <div className="good-button-container">
            <button onClick={onCancel}>Não</button>
            <button onClick={onConfirm}>Sim</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationModal;