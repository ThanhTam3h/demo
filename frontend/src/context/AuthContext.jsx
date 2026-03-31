import { createContext, useState } from "react";

// Bỏ qua cảnh báo Fast Refresh của Vite cho biến này
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			return JSON.parse(savedUser);
		}
		return null;
	});

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}
