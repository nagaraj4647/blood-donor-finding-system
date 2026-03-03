import { initializeApp, getApps, getApp } from "firebase/app";
interface Donor {
  id: string;
  available?: boolean;
  bloodGroup?: string;
  [key: string]: any;
}
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
  updateProfile,
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

type DonorDoc = {
  id: string;
  available?: boolean;
  blood_group?: string;
} & Record<string, any>;

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name && cred.user) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  return cred;
}

export async function signInWithEmailHelper(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function signInWithGoogle() {
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
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
  const normalizeGroup = (value: string) => {
    const raw = String(value || "").toUpperCase().trim();
    if (!raw) return "";

    // Normalize common variants:
    // "A +", "A Positive", "A+ve", "a positive" -> "A+"
    // "O -", "O Negative", "O-ve" -> "O-"
    const compact = raw
      .replace(/\s+/g, "")
      .replace(/POSITIVE|POS|\+VE|VE\+/g, "+")
      .replace(/NEGATIVE|NEG|-VE|VE-/g, "-");

    const match = compact.match(/^(AB|A|B|O)(\+|-)/);
    if (match) return `${match[1]}${match[2]}`;

    // fallback for already clean values
    return compact;
  };

  const requestedGroup = blood_group ? normalizeGroup(blood_group) : "";

  // Read all donors and filter in app layer so old docs (missing `available`)
  // and slightly different blood group formats still work.
  const snap = await getDocs(collection(db, "donors"));
  let docs: DonorDoc[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Record<string, any>),
  }));

  // Treat donor as available unless it is explicitly set to false.
  docs = docs.filter((d: any) => d.available !== false);

  if (requestedGroup) {
    docs = docs.filter(
      (d) => normalizeGroup(String(d.blood_group || "")) === requestedGroup
    );
  }

  // Location is intentionally ignored: same blood group from any location should be listed.
  return docs;
}

export async function updateDonorAvailability(id: string, available: boolean) {
  const ref = doc(db, "donors", id);
  return updateDoc(ref, { available });
}

export default app;
