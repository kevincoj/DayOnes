// components/KebabMenu.tsx

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  items: MenuItem[];
}

export default function KebabMenu({isOpen, onToggle, items}: Props) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 ${
          isOpen ? "bg-gray-100 text-gray-600" : ""
        }`}
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onToggle();
                item.onClick();
              }}
              className={`w-full text-left px-4 py-2 text-sm
                ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
