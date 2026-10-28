import type { LocalEnum } from "#/enum";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function bindMethods<T extends object>(instance: T): void {
	const prototype = Object.getPrototypeOf(instance);
	const propertyNames = Object.getOwnPropertyNames(prototype);

	propertyNames.forEach((propertyName) => {
		const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
		const propertyValue = instance[propertyName as keyof T];

		if (
			typeof propertyValue === "function" &&
			propertyName !== "constructor" &&
			descriptor &&
			!descriptor.get &&
			!descriptor.set
		) {
			instance[propertyName as keyof T] = propertyValue.bind(instance);
		}
	});
}

// Hàm ánh xạ: chuyển LocalEnum sang định dạng API
export function mapLocaleToAbpLanguageFormat(locale: keyof typeof LocalEnum): string {
	return locale.replace("_", "-");
}
