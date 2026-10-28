import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname } from "@/router/hooks";
import { useEffect } from "react";
import "./index.css";

// Cấu hình NProgress
NProgress.configure({
	showSpinner: false,
	minimum: 0.1,
	trickleSpeed: 200,
});

export default function ProgressBar() {
	const pathname = usePathname();

	useEffect(() => {
		NProgress.start();
		const timer = setTimeout(() => NProgress.done(), 100);

		return () => {
			clearTimeout(timer);
			NProgress.done();
		};
	}, [pathname]); // Giữ lại dependency pathname

	return null;
}
