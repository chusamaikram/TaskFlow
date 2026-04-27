import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

function normalizeFirebaseUser(fu) {
  return {
    uid:      fu.uid,
    name:     fu.displayName || fu.email?.split("@")[0] || "User",
    email:    fu.email,
    avatar:   fu.photoURL || null,
    joined:   fu.metadata?.creationTime
                ? new Date(fu.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "",
  };
}

// Merge Firebase auth user with Firestore profile fields
async function fetchUserProfile(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  const base = normalizeFirebaseUser(firebaseUser);
  if (snap.exists()) {
    const data = snap.data();
    return {
      ...base,
      role:     data.role     || "Team Member",
      bio:      data.bio      || "",
      location: data.location || "",
      name:     data.name     || base.name,
      avatar: data.avatar     || ""
    };
  }
  return { ...base, role: "Team Member", bio: "", location: "" };
}

// Create user doc in Firestore if it doesn't exist yet
async function createUserDoc(firebaseUser, extraFields = {}) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       firebaseUser.uid,
      name:      firebaseUser.displayName || extraFields.name || firebaseUser.email?.split("@")[0] || "User",
      email:     firebaseUser.email,
      avatar:    firebaseUser.photoURL || "",
      role:      "Team Member",
      bio:       "",
      location:  "",
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// useEffect(() => {
//   let isMounted = true;

//   const initAuth = async () => {
//     try {
//       // Handles Google redirect login result (VERY IMPORTANT for Vercel)
//       const result = await getRedirectResult(auth);

//       if (result?.user) {
//         await createUserDoc(result.user);
//       }
//     } catch (err) {
//       console.error("Redirect auth error:", err);
//     }
//   };

//   initAuth();

//   const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//     try {
//       if (!isMounted) return;

//       if (firebaseUser) {
//         const profile = await fetchUserProfile(firebaseUser);

//         if (isMounted) {
//           setUser(profile);
//         }
//       } else {
//         if (isMounted) {
//           setUser(null);
//         }
//       }
//     } catch (err) {
//       console.error("Auth state error:", err);
//       if (isMounted) setUser(null);
//     } finally {
//       if (isMounted) {
//         setLoading(false);
//       }
//     }
//   });

//   return () => {
//     isMounted = false;
//     unsub();
//   };
// }, []);

useEffect(() => {
  console.log("🔥 AUTH INIT: useEffect mounted");

  let isMounted = true;

  const initAuth = async () => {
    console.log("➡️ getRedirectResult START");

    try {
      const result = await getRedirectResult(auth);

      console.log("⬅️ getRedirectResult RESULT:", result?.user?.email || null);

      if (result?.user) {
        console.log("🟢 Creating Firestore user from redirect");
        await createUserDoc(result.user);
      }
    } catch (err) {
      console.log("❌ getRedirectResult ERROR:", err);
    }
  };

  initAuth();

  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("⚡ onAuthStateChanged TRIGGERED");

    console.log("👤 Firebase User:", firebaseUser?.email || null);

    try {
      if (!isMounted) return;

      if (firebaseUser) {
        console.log("📦 Fetching Firestore profile...");
        const profile = await fetchUserProfile(firebaseUser);

        console.log("✅ Profile loaded:", profile.email);

        setUser(profile);
      } else {
        console.log("🚪 No user found → setting null");
        setUser(null);
      }
    } catch (err) {
      console.log("❌ Auth error:", err);
      setUser(null);
    } finally {
      console.log("🏁 Setting loading = false");
      setLoading(false);
    }
  });

  return () => {
    console.log("🧹 Auth listener cleanup");
    isMounted = false;
    unsub();
  };
}, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Ensure user doc exists (for users created before Firestore integration)
    await createUserDoc(cred.user);
  };

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(cred.user, { displayName: name });
    await sendEmailVerification(cred.user);
    await createUserDoc({ ...cred.user, displayName: name }, { name });
    setUser({
      uid:      cred.user.uid,
      name,
      email,
      avatar:   null,
      role:     "Team Member",
      bio:      "",
      location: "",
      joined:   new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    if (window.location.hostname === "localhost") {
      const cred = await signInWithPopup(auth, provider);
      await createUserDoc(cred.user);
    } else {
      await signInWithRedirect(auth, provider);
    }
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateProfile = async (updates) => {
    if (!auth.currentUser) return;
    // Update Firebase Auth displayName if name changed
    if (updates.name) {
      await firebaseUpdateProfile(auth.currentUser, { displayName: updates.name });
    }
    // Update Firestore user doc
    const ref = doc(db, "users", auth.currentUser.uid);
    await updateDoc(ref, {
      ...(updates.name     && { name:     updates.name }),
      ...(updates.role     && { role:     updates.role }),
      ...(updates.bio      !== undefined && { bio:      updates.bio }),
      ...(updates.location !== undefined && { location: updates.location }),
    });
    // Update local state immediately
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
