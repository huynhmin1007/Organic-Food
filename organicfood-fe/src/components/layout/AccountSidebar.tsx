import { ChevronDown, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

type AccountMenuItem = {
  label: string;
  path?: string;
  children?: AccountMenuItem[];
};

const ACCOUNT_MENU: AccountMenuItem[] = [
  {
    label: "Thông tin tài khoản",
    children: [
      { label: "Tài khoản", path: "profile" },
      { label: "Đổi mật khẩu", path: "change-password" },
      { label: "Địa chỉ", path: "address" },
    ],
  },
  { label: "Đơn hàng", path: "orders" },
];

function MenuGroup({
  item,
  defaultOpen,
}: {
  item: AccountMenuItem;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen, item.children]);

  return (
    <div>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-2 py-1 mb-2 rounded-md hover:bg-neutral-50 text-sm font-medium"
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="pl-3">
          {item.children!.map((child) => (
            <NavLink
              key={child.path}
              to={child.path!}
              className={({ isActive }) =>
                `block px-2 py-1 rounded-md text-sm transition-colors mb-2 ${
                  isActive
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AccountSidebar() {
  return (
    <div className="bg-white rounded-md shadow-sm p-2 h-fit">
      {ACCOUNT_MENU.map((item) =>
        item.children?.length ? (
          <MenuGroup
            key={item.label}
            item={item}
            defaultOpen={item.label === "Thông tin tài khoản"}
          />
        ) : (
          <NavLink
            key={item.path}
            to={item.path!}
            className={({ isActive }) =>
              `block px-2 py-1 my-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "hover:bg-neutral-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ),
      )}
    </div>
  );
}
