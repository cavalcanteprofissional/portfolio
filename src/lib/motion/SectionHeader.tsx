import { useThemeStore } from '../../stores/themeStore';
import { Reveal } from './Reveal';

const HEADER_SIZES = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl',
} as const;

const HEADER_GAPS = {
  sm: 'mb-3',
  md: 'mb-4',
  lg: 'mb-6',
} as const;

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  size?: keyof typeof HEADER_SIZES;
  delay?: number;
  blur?: boolean;
  spacing?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  size = 'md',
  delay = 0,
  blur = true,
  spacing = 'mb-16',
  titleClassName = '',
  subtitleClassName = '',
}: SectionHeaderProps) {
  const { theme } = useThemeStore();
  const centered = align === 'center';

  return (
    <Reveal
      as="div"
      blur={blur}
      delay={delay}
      className={`${spacing} ${centered ? 'text-center' : 'text-left'}`}
    >
      <h2
        className={`${HEADER_SIZES[size]} font-bold ${HEADER_GAPS[size]} ${
          theme === 'dark' ? 'text-white' : 'text-gradient-blue'
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-muted-foreground ${subtitleClassName} ${centered ? 'max-w-2xl mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      <div
        className={`w-24 h-1.5 bg-gradient-blue rounded-full ${
          centered ? 'mx-auto' : ''
        } ${subtitle ? 'mt-4' : ''}`}
      />
    </Reveal>
  );
}
