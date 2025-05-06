import { Suspense } from 'react';
import AdminContracts from './components/ContractPage';

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <AdminContracts />
        </Suspense>
    );
}

