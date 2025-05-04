"use client";

import Sidebar from "../components/Sidebar";
const ContractPage = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
                <h1 className="text-4xl font-bold tracking-tight">Contracts</h1>
            </div>
            <div className="flex h-screen">
                <Sidebar />
            </div>
        </>
    );
};

export default ContractPage;

