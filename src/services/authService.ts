import { auth, googleProvider, db } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";

import { get, update } from "firebase/database";

export const handleGoogleSignIn = async (navigate: (path: string) => void) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        nickname: user.displayName || "",
        isOnline: true,
        lastUpdated: Date.now(),
        joinedAt: Date.now(),
        inChatRoom: false,
        status: "active",
        isEmailVerified: user.emailVerified,
        citizenPoint: 100,
        photoPoint: 100,
        isDisabled: false,
        banReason: "",
      });
    } else {
      await update(userRef, {
        isOnline: true,
        lastUpdated: Date.now(),
      });
    }

    console.log("✅ Đăng nhập Google thành công:", user);
    navigate("/");
    return user;
  } catch (error) {
    console.error("❌ Lỗi đăng nhập Google:", error);
    throw error;
  }
};
export const handleGoogleSignUp = async (navigate: (path: string) => void) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        nickname: user.displayName || "",
        isOnline: true,
        lastUpdated: Date.now(),
        joinedAt: Date.now(),
        inChatRoom: false,
        status: "active",
        isEmailVerified: user.emailVerified,
        citizenPoint: 100,
        photoPoint: 100,
        isDisabled: false,
        banReason: "",
      });

      console.log("✅ Đăng ký Google thành công:", user);
    } else {
      console.warn("⚠️ User đã tồn tại, không ghi đè dữ liệu.");
    }

  navigate("/");
  } catch (error) {
    console.error("❌ Lỗi đăng ký Google:", error);
    throw error;
  }
};