
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal Component', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    test('renders modal with title and message', () => {
        render(
            <ConfirmationModal
                show={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                message="Are you sure?"
            />
        );

        expect(screen.getByText('Delete Item')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button is clicked', () => {
        render(
            <ConfirmationModal
                show={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                message="Are you sure?"
            />
        );

        const confirmButton = screen.getByText('Confirm');
        fireEvent.click(confirmButton);

        expect(onConfirm).toHaveBeenCalled();
    });

    test('calls onClose when cancel button is clicked', () => {
        render(
            <ConfirmationModal
                show={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                message="Are you sure?"
            />
        );

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });

    test('returns null when show is false', () => {
        const { container } = render(
            <ConfirmationModal
                show={false}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                message="Are you sure?"
            />
        );

        expect(container.firstChild).toBeNull();
    });
});
