import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";
import { Button } from "@/components/ui/button";

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/signin"); // IMPORTANT
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="border-zinc-800 text-zinc-300"
    >
      Logout
    </Button>
  );
}
