import { useState, useCallback } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
	const [toasts, setToasts] = useState([]);
	const push = useCallback((msg, type = "success") => {
		const id = Date.now();
		setToasts((t) => [...t, { id, msg, type }]);
		setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
	}, []);
	return { toasts, push };
}

export function ToastContainer({ toasts }) {
	return (
		<div className="t-toast-container">
			{toasts.map((t) => (
				<div key={t.id} className={`t-toast t-toast-${t.type}`}>
					<span>{t.type === "success" ? "✓" : "✕"}</span>
					{t.msg}
				</div>
			))}
		</div>
	);
}
