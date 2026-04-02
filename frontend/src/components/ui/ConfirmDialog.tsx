import React from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    dangerous?: boolean;
}

const ConfirmDialog: React.FC<Props> = (
    {
        isOpen,
        title,
        message,
        confirmLabel = 'Confirm',
        onConfirm,
        onCancel,
        dangerous = false,
    }) => {
    if (!isOpen)
        return null;

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal-panel max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${dangerous ? 'bg-red-100' : 'bg-parchment-200'}`}>
                        <svg className={`w-6 h-6 ${dangerous ? 'text-red-600' : 'text-leather-600'}`} fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink text-center mb-2">{title}</h3>
                    <p className="font-body text-sm text-ink-400 text-center leading-relaxed">{message}</p>
                    <div className="flex gap-3 mt-6">
                        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${dangerous ? 'btn-danger' : 'btn-primary'}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
