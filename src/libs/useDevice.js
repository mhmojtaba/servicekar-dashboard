"use client";

import { useEffect, useState } from "react";

export function useDevice() {
	const [state, setState] = useState({
		ready: false,

		// Device
		deviceType: null,

		// OS
		os: null, // Android | iOS | Windows | macOS | Linux
		osVersion: null, // 7 | 8 | 10 | 11 | ...

		// Browser
		browser: null, // Chrome | Safari | Firefox | Edge | Opera
		browserVersion: null,

		// Extra
		isPWA: false,
	});

	useEffect(() => {
		const ua = navigator.userAgent;

		/* --------------------
       Device Type
    -------------------- */
		let deviceType = "desktop";
		if (/tablet|ipad/i.test(ua)) deviceType = "tablet";
		else if (/mobile|android|iphone|ipod/i.test(ua)) deviceType = "mobile";

		/* --------------------
       OS Detection
    -------------------- */
		let os = null;
		let osVersion = null;

		if (/android/i.test(ua)) {
			os = "Android";
			const match = ua.match(/Android\s([\d.]+)/);
			osVersion = match?.[1] || null;
		} else if (/iphone|ipad|ipod/i.test(ua)) {
			os = "iOS";
			const match = ua.match(/OS (\d+[_\d]+)/);
			osVersion = match ? match[1].replace(/_/g, ".") : null;
		} else if (/windows nt/i.test(ua)) {
			os = "Windows";
			if (ua.includes("Windows NT 10.0")) osVersion = "10 / 11";
			else if (ua.includes("Windows NT 6.3")) osVersion = "8.1";
			else if (ua.includes("Windows NT 6.2")) osVersion = "8";
			else if (ua.includes("Windows NT 6.1")) osVersion = "7";
		} else if (/mac os x/i.test(ua)) {
			os = "macOS";
			const match = ua.match(/Mac OS X (\d+[_\d]+)/);
			osVersion = match ? match[1].replace(/_/g, ".") : null;
		} else if (/linux/i.test(ua)) {
			os = "Linux";
		}

		/* --------------------
       Browser Detection
    -------------------- */
		let browser = null;
		let browserVersion = null;

		if (/edg/i.test(ua)) {
			browser = "Edge";
			browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1];
		} else if (/opr|opera/i.test(ua)) {
			browser = "Opera";
			browserVersion = ua.match(/(Opera|OPR)\/([\d.]+)/)?.[2];
		} else if (/chrome/i.test(ua)) {
			browser = "Chrome";
			browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1];
		} else if (/firefox/i.test(ua)) {
			browser = "Firefox";
			browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1];
		} else if (/safari/i.test(ua)) {
			browser = "Safari";
			browserVersion = ua.match(/Version\/([\d.]+)/)?.[1];
		}

		/* --------------------
       PWA Detection
    -------------------- */
		const isPWA =
			window.matchMedia("(display-mode: standalone)").matches ||
			window.navigator.standalone === true;

		setState({
			ready: true,
			deviceType,
			os,
			osVersion,
			browser,
			browserVersion,
			isPWA,
		});
	}, []);

	return state;
}
