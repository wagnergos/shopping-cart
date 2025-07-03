import { useUser } from "@/context/user-context";

export function UserStatusSection() {
  const { user, toggleUserType } = useUser();

  return (
    <div className="mt-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            User Status:
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.isVip
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.isVip ? "VIP" : "Common"}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleUserType}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
          aria-label={`Switch to ${user.isVip ? "Common" : "VIP"} user status`}
        >
          {user.isVip ? "Switch to Common" : "Switch to VIP"}
        </button>
      </div>
      {user.isVip && (
        <p className="mt-2 text-xs text-gray-600">
          VIP users get 15% discount or "Buy 3 Pay 2" promotion (whichever is
          better)
        </p>
      )}
    </div>
  );
}
