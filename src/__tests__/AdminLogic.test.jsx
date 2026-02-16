
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { checkIsAdmin } from '../admin';
import { logAdminAction } from '../lib/audit';
import { auth } from '../firebase';
import { addDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('../firebase', () => ({
    db: {},
    auth: {
        currentUser: { email: 'admin@example.com', uid: 'admin-123' }
    }
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp')
}));

describe('Admin Logic & Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('checkIsAdmin', () => {
        test('returns true for hardcoded admin email', async () => {
            const mockUser = { email: 'lostresmacarons@gmail.com' };
            const isAdmin = await checkIsAdmin(mockUser);
            expect(isAdmin).toBe(true);
        });

        test('returns true for user with admin custom claim', async () => {
            const mockUser = {
                email: 'other@example.com',
                getIdTokenResult: vi.fn().mockResolvedValue({
                    claims: { admin: true }
                })
            };
            const isAdmin = await checkIsAdmin(mockUser);
            expect(isAdmin).toBe(true);
        });

        test('returns false for regular user without claim', async () => {
            const mockUser = {
                email: 'user@example.com',
                getIdTokenResult: vi.fn().mockResolvedValue({
                    claims: {}
                })
            };
            const isAdmin = await checkIsAdmin(mockUser);
            expect(isAdmin).toBe(false);
        });

        test('returns false when no user is provided', async () => {
            const isAdmin = await checkIsAdmin(null);
            expect(isAdmin).toBe(false);
        });
    });

    describe('logAdminAction', () => {
        test('calls addDoc with correct parameters', async () => {
            const action = 'TEST_ACTION';
            const details = { foo: 'bar' };

            await logAdminAction(action, details);

            expect(addDoc).toHaveBeenCalled();
            const callArgs = addDoc.mock.calls[0];
            expect(callArgs[1]).toMatchObject({
                adminEmail: 'admin@example.com',
                adminUid: 'admin-123',
                action: 'TEST_ACTION',
                details: { foo: 'bar' },
                timestamp: 'mock-timestamp'
            });
        });

        test('does nothing if user is not logged in', async () => {
            auth.currentUser = null;
            await logAdminAction('TEST', {});
            expect(addDoc).not.toHaveBeenCalled();
            // Restore for other tests
            auth.currentUser = { email: 'admin@example.com', uid: 'admin-123' };
        });
    });
});
