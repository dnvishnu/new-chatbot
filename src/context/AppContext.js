"use client";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "@/app/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCredits, setUserCredits] = useState();
  const [loader, setLoader] = useState(true); // Initially true until Firebase checks

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setLoader(true);
        setUser(currentUser);
        console.log(currentUser.photoURL);
        const querySnapshotNew = await getDocs(
          query(
            collection(db, "userdata"),
            where("email", "==", currentUser.email)
          )
        );

        if (!querySnapshotNew.empty) {
          const userData = querySnapshotNew.docs[0].data();
          setUserCredits(userData.credits);
        }
        setLoader(false);
      } else {
        setUser(null);
        setLoader(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const reduceCredits = async (n) => {
    const querySnapshotNew = await getDocs(
      query(collection(db, "userdata"), where("email", "==", user.email))
    );
    const documentRef = doc(db, "userdata", querySnapshotNew.docs[0].id);
    updateDoc(documentRef, {
      credits: userCredits - n,
    });
    setUserCredits((prev) => prev - n);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userCredits,
        loader,
        reduceCredits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
