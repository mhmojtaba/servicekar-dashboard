"use client";

import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import usePushNotification from "@/hooks/usePushNotification/usePushNotification";

export default function PushNotificationProvider({
	BASE_URL,
	pushNotificationKey,
	children,
}) {
	const { user } = useAuth();

	usePushNotification(user, BASE_URL, pushNotificationKey);

	useEffect(() => {
		if (user)
			console.log("Push notifications ready for:", user.first_name || user.id);
	}, [user]);

	return children;
}
