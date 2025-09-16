import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginUser from "types/LoginUser";

const useUser = () => {
  const [user, setUser] = useState<LoginUser | null>(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);
  return { status, user };
};

export default useUser;
