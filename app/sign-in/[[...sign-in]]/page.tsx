import { SignIn } from '@clerk/nextjs';
export default function SignInPage(){
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <SignIn appearance={{ elements:{ formButtonPrimary:'bg-[var(--accent-color)] text-black' } }} />
    </div>
  );
}
