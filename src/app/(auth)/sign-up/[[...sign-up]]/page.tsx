import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp 
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#1152d4] hover:bg-blue-700 text-sm normal-case",
          card: "shadow-none border-none p-0",
          headerTitle: "text-2xl font-bold text-gray-900",
          headerSubtitle: "text-gray-500",
          socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
          dividerLine: "bg-gray-100",
          dividerText: "text-gray-400 text-xs",
          formFieldLabel: "text-gray-700 font-medium",
          formFieldInput: "h-12 border-gray-200 focus:ring-[#1152d4] focus:border-[#1152d4] rounded-lg"
        }
      }}
    />
  );
}