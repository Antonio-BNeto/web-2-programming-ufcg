import Image from 'next/image';

interface Props {
  size?: number;
  showText?: boolean;
  textSize?: string;
  subtitle?: string;
}

export default function BrasaLogo({
  size = 36,
  showText = true,
  textSize = 'text-2xl',
  subtitle,
}: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <Image src="/images/logo_brasa.svg" alt="Brasa" width={size} height={size} priority />
      {showText && (
        <div>
          <span className={`${textSize} font-bold text-gradient-brasa leading-none`}>Brasa</span>
          {subtitle && <p className="text-xs text-gray-400 leading-none mt-0.5">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
