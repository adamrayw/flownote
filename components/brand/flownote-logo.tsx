import Image from 'next/image';

type FlowNoteLogoProps = {
  className?: string;
  priority?: boolean;
};

export function FlowNoteLogo({
  className = 'h-9 w-9',
  priority = false,
}: FlowNoteLogoProps) {
  return (
    <Image
      src="/brand/flownote-logo.png"
      alt="FlowNote logo"
      width={128}
      height={128}
      className={className}
      priority={priority}
    />
  );
}
