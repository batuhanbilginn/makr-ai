import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <div className="grid w-full h-screen grid-cols-2">
      <LoginForm />
      <div className="border-l-2 bg-gradient-to-r from-emerald-300 to-emerald-700 border-emerald-500" />
    </div>
  );
};

export default LoginPage;
