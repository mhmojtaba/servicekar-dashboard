"use client";
import { useEffect } from "react";
import axios from "axios";

export default function usePushNotification(
	user,
	BASE_URL,
	pushNotificationKey
) {
	useEffect(() => {
		if (!user?.id || !pushNotificationKey) return; // فقط وقتی کاربر لاگین است

		const registerPush = async () => {
			if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
				console.warn("Push notifications not supported");
				return;
			}

			try {
				// ثبت Service Worker
				const registration = await navigator.serviceWorker.register(
					"/user/service-worker.js"
				);

				// بررسی permission
				if (Notification.permission !== "granted") {
					const permission = await Notification.requestPermission();
					if (permission !== "granted") return;
				}

				// گرفتن subscription موجود
				const existingSubscription =
					await registration.pushManager.getSubscription();

				// if (existingSubscription) {
				//   console.log("✅ Push subscription already exists");
				//   return; // قبلا ست شده، نیازی به ارسال دوباره به سرور نیست
				// }

				// گرفتن VAPID public key از env
				const vapidPublicKey = pushNotificationKey;

				const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

				// ایجاد subscription جدید
				const newSubscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey,
				});

				// ارسال subscription به سرور
				await axios.post(`${BASE_URL}/notifications/save_subscription.php`, {
					user_id: user.id,
					subscription: newSubscription,
				});

				console.log("✅ Push subscription created and sent to server");
			} catch (err) {
				console.error("❌ Push registration failed:", err);
			}
		};

		registerPush();
	}, [user, pushNotificationKey, BASE_URL]);
}

// تبدیل Base64 به Uint8Array
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}
