import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const InteractiveBackground: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springing for the glow effect
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Initial values for parallax
    const parallaxX = useMotionValue(0);
    const parallaxY = useMotionValue(0);
    const smoothParallaxX = useSpring(parallaxX, springConfig);
    const smoothParallaxY = useSpring(parallaxY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Interactive Glow Blobs */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-[hsl(var(--saffron))]/10 blur-[120px]"
                style={{
                    left: cursorX,
                    top: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--gold))]/10 blur-[80px]"
                style={{
                    left: cursorX,
                    top: cursorY,
                    translateX: "50%",
                    translateY: "50%",
                }}
            />

            {/* Ambient Background Elements */}
            <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[hsl(var(--emerald-india))]/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-[hsl(var(--primary))]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

            {/* Subtle Mandala Parallax (Mock) */}
            <motion.div
                className="absolute inset-0 pattern-mandala opacity-[0.03]"
                style={{
                    x: smoothParallaxX,
                    y: smoothParallaxY,
                }}
            />
        </div>
    );
};
