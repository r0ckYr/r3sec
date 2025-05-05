import { Suspense } from 'react';
import ResetPassword from './components/ResetPasswordPage';

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <ResetPassword />
        </Suspense>
    );
}
