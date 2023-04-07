"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginForm = () => {
  const { signInWithGithub, user } = useAuth();
  const router = useRouter();

  // Check if there is a user
  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex items-center w-full h-full px-8">
      {/* Main Container */}
      <div className="w-full ">
        {/* Text */}
        <div>
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Welcome to the{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              makr.AI
            </span>{" "}
            Please login with your Github account.
          </p>
        </div>
        {/* Github Button */}
        <Button
          onClick={signInWithGithub}
          className="flex items-center w-full gap-2 mt-6"
        >
          Login with Github <Github size="16" />
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
