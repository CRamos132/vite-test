import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";

const AuthContext = createContext({
  user: null,
  signInWithGoogle: () => { },
  isInit: false
});

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInit, setIsInit] = useState(false)

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log("🚀 ~ token:", token)
        // The signed-in user info.
        const user = result.user;
        console.log("🚀 ~ user:", user)
        // router.push('/')
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log("🚀 ~ errorCode:", errorCode)
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, data => {
      console.log("🚀 ~ user:", data)
      setIsInit(true)
      if (!data) return
      // data.getIdTokenResult().then((IdTokenResult) => {
      //   if (IdTokenResult?.claims?.admin) {
      //     // setIsAdmin(true)
      //   }
      // })
      setUser(data)
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        isInit
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };