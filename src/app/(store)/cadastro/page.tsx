import { RegisterForm } from "@/components/auth/register-form";
import { SectionHeading } from "@/components/store/section-heading";

export default function CadastroPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <SectionHeading title="Criar conta" />
      <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
        <RegisterForm />
      </div>
    </div>
  );
}
