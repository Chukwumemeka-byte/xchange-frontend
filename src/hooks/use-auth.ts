import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, setTokens, clearTokens } from "@/lib/api";
import { useAppStore } from "@/store/use-app-store";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      const isSuperAdmin = data.user.role === "super_admin";
      useAppStore.getState().setRole(isSuperAdmin ? "admin" : "viewer");
      setUser({
        id: data.user.id,
        name: `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.username,
        email: data.user.email,
        role: isSuperAdmin ? "admin" : "viewer",
      });
      router.push(isSuperAdmin ? "/dashboard" : "/home");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return () => {
    clearTokens();
    setUser(null);
    router.push("/login");
  };
}
