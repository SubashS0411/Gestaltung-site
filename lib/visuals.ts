export type VisualType = 'gradient' | 'noise' | 'grid' | 'orb';

export interface GeneratedVisual {
    type: VisualType;
    style: React.CSSProperties;
    className?: string;
}

/**
 * Generates a premium gold/dark gradient style
 */
export function generateGoldGradient(variant: 'linear' | 'radial' = 'linear'): React.CSSProperties {
    if (variant === 'radial') {
        return {
            background: `radial-gradient(circle at 50% 50%, #D4AF37 0%, rgba(212, 175, 55, 0.2) 50%, rgba(5, 5, 5, 0) 100%)`,
        };
    }
    return {
        background: `linear-gradient(135deg, #AA8C2C 0%, #D4AF37 50%, #F3E5AB 100%)`,
    };
}

/**
 * Generates a cinematic noise pattern style
 */
export function generateNoisePattern(): React.CSSProperties {
    return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        opacity: 0.4,
        mixBlendMode: 'overlay',
    };
}

/**
 * Generates a grid background style
 */
export function generateGridPattern(): React.CSSProperties {
    return {
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
    };
}

/**
 * Maps a category to a visual style for the Foundry items
 */
export function getVisualForCategory(category: string): GeneratedVisual {
    switch (category) {
        case 'MOTION':
            return {
                type: 'grid',
                style: {
                    ...generateGridPattern(),
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                },
                className: 'opacity-50',
            };
        case 'ASSETS':
        case 'UI':
            return {
                type: 'gradient',
                style: generateGoldGradient('linear'),
                className: 'opacity-80 mix-blend-screen',
            };
        case 'EFFECTS':
            return {
                type: 'noise',
                style: generateNoisePattern(),
                className: 'opacity-60',
            };
        case 'SCROLL':
            return {
                type: 'orb',
                style: generateGoldGradient('radial'),
                className: 'blur-xl opacity-40',
            };
        default:
            return {
                type: 'grid',
                style: generateGridPattern(),
                className: 'opacity-30',
            };
    }
}
