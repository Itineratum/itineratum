import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { use } from "react";

const ProtectedRoute = () => {
  const session = use(getServerSession());

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      This is a protected route. You will only see this if you are logged in.
    </div>
  );
};

export default ProtectedRoute;
