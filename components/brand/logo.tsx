import Image from "next/image";

const Logo = () => {
  return (
    <Image
      className="max-w-[70px]"
      width={296}
      height={77}
      src="/makr-logo.svg"
      alt="makr-logo"
    />
  );
};

export default Logo;
