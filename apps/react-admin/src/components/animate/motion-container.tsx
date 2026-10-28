import { type MotionProps, m } from "framer-motion";

import { varContainer } from "./variants/container";

interface Props extends MotionProps {
	className?: string;
}

/**
 * Motion container dùng chung
 *
 * variants: [Biến thể có thể dùng một prop animation duy nhất để tạo animation cho toàn bộ cây con của component](https://www.framer.com/motion/animation/#variants)
 *
 * Variants là một tập hợp các đối tượng được định nghĩa trước
 * const variants = {
 *   visible: { opacity: 1 },
 *   hidden: { opacity: 0 },
 * }
 *
 * Cần chỉ định tên thuộc tính inital và animate
 * <motion.div
 *  initial="hidden"
 *  animate="visible"
 *  variants={variants}
 * />
 */
export default function MotionContainer({ children, className }: Props) {
	return (
		<m.div
			// Sau khi chỉ định tên thuộc tính initial, animate và exit ở đây, các component con không cần chỉ định lại nữa
			initial="initial"
			animate="animate"
			exit="exit"
			variants={varContainer()}
			className={className}
		>
			{children}
		</m.div>
	);
}
