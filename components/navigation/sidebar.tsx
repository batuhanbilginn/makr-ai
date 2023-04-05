import Logo from "../brand/logo";
import Chats from "../chat/chats";
import ProfileMenu from "./profile-menu";

const Sidebar = () => {
  return (
    <aside className="w-full max-w-[260px] h-screen px-4 py-8 shadow-md dark:border-neutral-800 border-neutral-200">
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Logo */}
          <Logo className="max-w-[70px]" />
          <Chats />
        </div>
        {/* Footer Menu */}
        <ProfileMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
