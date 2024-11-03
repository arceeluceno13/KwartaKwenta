import { useSession, signOut } from "next-auth/react";
import { useAuthContext, useAuthContextType } from "../context/AuthContext";
import { useEffect } from "react";

export default function Dashboard(){
    const { data: session } = useSession<any>();
    const { state, dispatch }: useAuthContextType = useAuthContext();


    function signOutHandle() {
        signOut();
        } 

    return(
      <div>test <br></br>
        <button onClick={signOutHandle}>SignOut</button>
      </div>
      

    );
}