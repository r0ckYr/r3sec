// ScrollableMessageArea.tsx - Create this as a separate component file
import React, { useRef, useEffect } from "react";
import { User, UserCog, Clock3, CheckCircle2, MessageSquare } from "lucide-react";

interface Message {
    id: string;
    contract_id: string;
    sender_id: string;
    sender_role: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

interface ScrollableMessageAreaProps {
    messages: Message[];
    messagesLoading: boolean;
    formatMessageTime: (dateString: string) => string;
}

const ScrollableMessageArea: React.FC<ScrollableMessageAreaProps> = ({
    messages,
    messagesLoading,
    formatMessageTime
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative">
            <div
                className="absolute inset-0 overflow-y-auto scrollbar-custom"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4b5563 #111827',
                }}
            >
                <div className="p-4 space-y-4">
                    {messagesLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-green-400 animate-spin"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <MessageSquare size={48} className="text-zinc-700 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
                            <p className="text-zinc-400 max-w-md">
                                Start a conversation about your contract by sending a message below. Our team will respond as soon as possible.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.sender_role === 'user'
                                            ? 'bg-green-900/20 border border-green-800/30 text-white'
                                            : 'bg-zinc-800/50 border border-zinc-700/30 text-white'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`p-1 rounded-full ${message.sender_role === 'user' ? 'bg-green-800/50' : 'bg-zinc-700/50'
                                                }`}>
                                                {message.sender_role === 'user'
                                                    ? <User size={12} className="text-green-400" />
                                                    : <UserCog size={12} className="text-blue-400" />
                                                }
                                            </span>
                                            <span className="text-xs font-medium">
                                                {message.sender_role === 'user' ? 'You' : 'Support Team'}
                                            </span>
                                            <span className="text-xs text-zinc-400">
                                                {formatMessageTime(message.created_at)}
                                            </span>
                                            {message.sender_role === 'admin' && (
                                                <span className="ml-auto">
                                                    {message.is_read ? (
                                                        <CheckCircle2 size={12} className="text-green-400" />
                                                    ) : (
                                                        <Clock3 size={12} className="text-zinc-400" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScrollableMessageArea;
