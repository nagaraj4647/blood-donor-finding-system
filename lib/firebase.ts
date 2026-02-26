import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Authentication (email/password + Google)
export const auth = getAuth(app);

// Use local persistence (users stay logged in across browser sessions)
setPersistence(auth, browserLocalPersistence).catch(() => {
  // ignore persistence errors in environments that don't support it
});

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmailHelper(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function onAuthStateChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function addDonor(data: Record<string, any>) {
  return addDoc(collection(db, "donors"), data);
}

export async function findDonorByPhone(phone: string) {
  const q = query(collection(db, "donors"), where("phone", "==", phone));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Record<string, any>) };
}

export async function addRequest(data: Record<string, any>) {
  return addDoc(collection(db, "blood_requests"), data);
}

export async function findDonors(blood_group?: string, location?: string) {
  let q;
  if (blood_group) {
    q = query(
      collection(db, "donors"),
      where("available", "==", true),
      where("blood_group", "==", blood_group.toUpperCase().trim())
    );
  } else {
    q = query(collection(db, "donors"), where("available", "==", true));
  }

  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) }));

  // Optional: Sort by location match if location is provided, but don't filter
  if (!location) return docs;

  const loc = location.toLowerCase();
  return docs.sort((a, b) => {
    const aMatch = 
      (a.district || "").toLowerCase().includes(loc) ||
      (a.place || "").toLowerCase().includes(loc) ||
      (a.state || "").toLowerCase().includes(loc);
    const bMatch = 
      (b.district || "").toLowerCase().includes(loc) ||
      (b.place || "").toLowerCase().includes(loc) ||
      (b.state || "").toLowerCase().includes(loc);
    return bMatch ? 1 : -1; // Location matches appear first
  });
}

export async function updateDonorAvailability(id: string, available: boolean) {
  const ref = doc(db, "donors", id);
  return updateDoc(ref, { available });
}

export default app;
