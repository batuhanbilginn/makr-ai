import Logo from "@/components/brand/logo";
import Image from "next/image";
import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <div className="grid w-full h-screen grid-cols-1 md:grid-cols-2">
      <LoginForm />
      {/* Gradient */}
      <div className="relative hidden w-full overflow-hidden rounded-l-2xl md:block">
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-lg" />
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
          <div>
            <Logo />
            <div className="text-4xl font-bold">
              <div>AI Assistant for Makers</div>
            </div>
          </div>
        </div>
        <Image
          priority
          sizes="50vw"
          className="z-0"
          alt="gradient"
          fill
          src="/login-gradient.jpg"
        />
      </div>
    </div>
  );
};

export default LoginPage;
