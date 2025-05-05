import { Suspense } from 'react';
import ChatPage from './components/ChatPage';

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <ChatPage />
        </Suspense>
    );
}
