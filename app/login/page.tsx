import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <div className="grid w-full h-[100vh] grid-cols-1 md:grid-cols-3">
      <LoginForm />
      {/* Gradient */}
      <div className="relative hidden w-full overflow-hidden md:col-span-2 rounded-l-2xl md:block">
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-lg" />
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
          <div>
            <Image
              className="max-w-[200px]"
              width={296}
              height={77}
              src="/makr-logo-dark.svg"
              alt="makr-logo"
            />
            <div className="mt-4">
              <div className="text-2xl font-medium text-neutral-900">
                A ChatGPT clone with enhanced features for makers.
              </div>
              <div className="max-w-xl text-sm text-neutral-700">
                ChatGPT is a product of OpenAI and makr.AI is{" "}
                <span className="font-medium text-neutral-800">
                  100% unaffiliated with OpenAI.
                </span>{" "}
                In order to use this procut, you must get your OpenAI API key
                from their{" "}
                <Link
                  className="underline underline-offset-4"
                  href="https://platform.openai.com"
                >
                  website
                </Link>
                .
              </div>
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
