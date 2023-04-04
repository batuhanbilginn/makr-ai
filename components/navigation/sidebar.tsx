import Logo from "../brand/logo";

const Sidebar = () => {
  return (
    <aside className="inline-block h-screen px-4 py-8 shadow-md dark:border-neutral-800 border-neutral-200">
      <Logo />
    </aside>
  );
};

export default Sidebar;
