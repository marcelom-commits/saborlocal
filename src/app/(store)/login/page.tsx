import { LoginForm } from "@/components/auth/login-form";
import { SectionHeading } from "@/components/store/section-heading";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <SectionHeading title="Entrar" />
      <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
        <LoginForm />
      </div>
    </div>
  );
}
