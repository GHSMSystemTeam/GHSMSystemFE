import { useState, useEffect } from "react";

export default function SlideShow() {
    const images = [
        "https://placehold.co/800x350/667eea/ffffff?text=Medical+Center+1",
        "https://placehold.co/800x350/667eea/ffffff?text=Medical+Center+2",
        "https://placehold.co/800x350/667eea/ffffff?text=Medical+Center+3",
        "https://placehold.co/800x350/667eea/ffffff?text=Medical+Center+4"
    ];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="w-full mb-10">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                    src={images[current]}
                    alt={`slide-${current + 1}`}
                    className="w-full h-80 md:h-[28rem] object-cover transition-all duration-700"
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-white/70"} border border-blue-400`}
                            onClick={() => setCurrent(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}