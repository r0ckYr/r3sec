import { Suspense } from 'react';
import ContractPage from './components/ContractPage';

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <ContractPage />
        </Suspense>
    );
}
