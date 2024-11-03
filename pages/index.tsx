import { useSession } from "next-auth/react";
import { useAuthContext, useAuthContextType } from "../context/AuthContext";
import { useEffect } from "react";
import Login from "./login";
import Dashboard from "./dashboard";

export default function Home() {
  const { data: session } = useSession<any>();
  const { state }: useAuthContextType = useAuthContext();



  useEffect(() => {
    console.log("state ", state.user?._id);
  }, [state]);

  return (
    <div className="w-full h-screen">
      {session ? (
        <Dashboard />
      ) : (
        <Login />
      )}
    </div>
  );
}
