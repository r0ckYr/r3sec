import { Suspense } from 'react';
import AdminChatPage from './components/InboxPage';

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <AdminChatPage />
        </Suspense>
    );
}

