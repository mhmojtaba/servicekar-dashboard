import { withBasePath } from "@/config/deployment-config.mjs";

export const dynamic = "force-static";

export default function manifest() {
	return {
		name: "خدمات گستر جزائری-داشبورد کاربری",
		short_name: "داشبورد کاربری",
		description: "داشبورد کاربری خدمات گستر جزائری",
		start_url: withBasePath("/"),
		scope: withBasePath("/"),
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#1e40af",
		icons: [192, 512].flatMap((size) => [
			{
				src: withBasePath(`/icons/icon-${size}.png`),
				sizes: `${size}x${size}`,
				type: "image/png",
			},
			{
				src: withBasePath(`/icons/icon-${size}-maskable.png`),
				sizes: `${size}x${size}`,
				type: "image/png",
				purpose: "maskable",
			},
		]),
	};
}
