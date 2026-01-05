import React, { useEffect, useState, useRef } from 'react';
import UIEventBus from '../EventBus';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipData {
    text: string;
    x: number;
    y: number;
}

const TooltipHint: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<TooltipData>({ text: '', x: 0, y: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (detail: any) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Update data immediately
            setData({
                text: detail.text,
                x: detail.x,
                y: detail.y
            });
            setVisible(true);

            // Hide after 1100ms + fade in time? 
            // Request says: "Mostrar 1100ms (visible) + fade in 120ms + fade out 200ms."
            // So total visible time around 1.1s is good.
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
            }, 1100 + 120);
        };

        UIEventBus.on('showTooltip', handler);

        return () => {
            UIEventBus.remove('showTooltip', handler);
        };
    }, []);

    // Clamp position to screen
    const clampX = (x: number) => Math.min(Math.max(x, 10), window.innerWidth - 220); // roughly tooltip width
    const clampY = (y: number) => Math.min(Math.max(y, 10), window.innerHeight - 60);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        enter: { duration: 0.12 }, // 120ms fade in
                        exit: { duration: 0.2 } // 200ms fade out
                    }}
                    style={{
                        position: 'fixed',
                        left: clampX(data.x + 12), // Offset +12px
                        top: clampY(data.y + 12),
                        background: '#1a1a1a', // Dark background
                        border: '1px solid #444', // Soft gray border
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)', // Subtle shadow
                        color: '#eee',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: "'Inter', sans-serif", // Consistent OS typography (assuming Inter/sans)
                        pointerEvents: 'none',
                        zIndex: 10000,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {data.text}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TooltipHint;
