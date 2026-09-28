import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { BellIcon } from "./icon/BellIcon";

export default function Notification() {
  return (
    <Link to={"/notification"}>
      <div className="relative">
        <BellIcon size={24} className="text-white" />
        <span className="absolute top-[-4] right-[-4] bg-red-500 border border-white rounded-full w-[16px] h-[16px]" />
      </div>
    </Link>
  );
}
