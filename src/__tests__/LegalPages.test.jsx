
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import LegalInfo from '../pages/LegalInfo';
import TermsOfService from '../pages/TermsOfService';
import DataDeletion from '../pages/DataDeletion';

describe('Legal Pages', () => {
    // Mock scrollTo
    window.scrollTo = vi.fn();

    test('renders LegalInfo correctly', () => {
        render(
            <BrowserRouter>
                <LegalInfo />
            </BrowserRouter>
        );
        expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    });

    test('renders TermsOfService correctly', () => {
        render(
            <BrowserRouter>
                <TermsOfService />
            </BrowserRouter>
        );
        expect(screen.getByRole('heading', { level: 1, name: /Terms of Service/i })).toBeInTheDocument();
    });

    test('renders DataDeletion correctly', () => {
        render(
            <BrowserRouter>
                <DataDeletion />
            </BrowserRouter>
        );
        expect(screen.getByRole('heading', { level: 1, name: /Data Deletion/i })).toBeInTheDocument();
    });
});
