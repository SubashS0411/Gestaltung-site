"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Assistant() {
    const { assistantMessages, addMessage } = useAppStore();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [assistantMessages]);

    const handleSend = () => {
        if (!input.trim()) return;
        addMessage("user", input.trim());
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Analyzing your request... The recommended pattern for this use case is a staggered reveal with useInView hooks. Each element should fade-up with a 50ms delay offset.",
                "Protocol confirmed. For optimal performance, wrap your animated elements in transform-gpu containers and use will-change-transform sparingly.",
                "The Void & Gold design system specifies: primary headers use text-gradient-gold, body text at rgba(255,255,255,0.6), and all borders at rgba(255,255,255,0.06).",
                "Recommendation: Use Lenis with lerp: 0.06 and wheelMultiplier: 0.8 for the premium scroll feel. Avoid easing functions that create jarring stops.",
                "Component structure validated. Your glassmorphism stack should be: bg-white/5 → backdrop-blur-xl → border-white/10 → hover:border-gold/30.",
            ];
            addMessage("assistant", responses[Math.floor(Math.random() * responses.length)]);
        }, 800 + Math.random() * 1200);
    };

    return (
        <aside className="fixed right-0 top-0 bottom-0 w-[320px] bg-[#050505]/90 backdrop-blur-xl border-l border-white/[0.06] z-40 flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gold stroke-[1.5]" />
                <span className="font-mono text-[10px] text-gold tracking-[0.3em]">NEURAL ASSISTANT</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                <AnimatePresence>
                    {assistantMessages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-gold/10 border border-gold/20" : "bg-white/5 border border-white/10"
                                }`}>
                                {msg.role === "assistant" ? (
                                    <Bot className="w-3 h-3 text-gold" />
                                ) : (
                                    <User className="w-3 h-3 text-white/90" />
                                )}
                            </div>
                            <div className={`max-w-[85%] px-4 py-3 rounded-xl ${msg.role === "assistant"
                                    ? "bg-white/[0.04] border border-white/[0.06]"
                                    : "bg-gold/[0.08] border border-gold/10"
                                }`}>
                                <p className="font-mono text-[11px] text-white/70 leading-relaxed tracking-wide">
                                    {msg.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 focus-within:border-gold/20 transition-colors">
                    <span className="font-mono text-[11px] text-gold/50">&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Enter Protocol..."
                        className="flex-1 bg-transparent font-mono text-[11px] text-white/80 tracking-wider placeholder:text-white/70 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="text-white/70 hover:text-gold transition-colors duration-300"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
