import { Suspense } from 'react';
import AdminUsers from './components/UserPage';
export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <AdminUsers />
        </Suspense>
    );
}

