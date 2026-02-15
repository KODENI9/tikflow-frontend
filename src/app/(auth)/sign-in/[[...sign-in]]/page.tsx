import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h2>
        <p className="text-gray-500">Connectez-vous pour gérer vos coins TikTok.</p>
      </div>

      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-none p-0 w-full bg-transparent",
            header: "hidden", // On cache le header par défaut de Clerk car on a le nôtre au-dessus
            formButtonPrimary: "bg-[#1152d4] hover:bg-blue-700 text-sm normal-case py-3 rounded-lg shadow-lg shadow-blue-600/20",
            socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 h-12 rounded-lg",
            formFieldInput: "h-12 border-gray-200 focus:ring-[#1152d4] focus:border-[#1152d4] rounded-lg",
            footerAction: "hidden", // On peut aussi le personnaliser pour renvoyer vers Register
          }
        }}
      />
      
      {/* Petit lien personnalisé en bas si besoin */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Pas encore de compte ?{" "}
        <a href="/sign-up" className="text-[#1152d4] font-semibold hover:underline">
          Inscrivez-vous gratuitement
        </a>
      </p>
    </div>
  );
}