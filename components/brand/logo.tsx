import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={className}
      width={296}
      height={77}
      src="/makr-logo.svg"
      alt="makr-logo"
    />
  );
};

export default Logo;
