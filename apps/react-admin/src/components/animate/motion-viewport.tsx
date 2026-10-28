import { type MotionProps, m } from "framer-motion";

import { varContainer } from "./variants";

interface Props extends MotionProps {
	className?: string;
}
/**
 * [whileInView: phần tử có thể đặt animation khi đi vào/ra khỏi khung nhìn](https://www.framer.com/motion/scroll-animations/#scroll-triggered-animations)
 *
 * + viewport: [khung nhìn](https://www.framer.com/motion/scroll-animations/###viewport)
 *
 *    + once: chỉ kích hoạt một lần
 */
export default function MotionViewport({ children, className, ...other }: Props) {
	return (
		<m.div
			initial="initial"
			whileInView="animate"
			viewport={{ once: true, amount: 0.3 }}
			variants={varContainer()}
			className={className}
			{...other}
		>
			{children}
		</m.div>
	);
}
