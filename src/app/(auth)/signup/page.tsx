import { ManualSignupForm } from '@/features/auth/components/ManualSignupForm';
import { OAuthLogin } from '@/features/auth/components/OAuthLogin';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">CosmoDex</h1>
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Already have an account? Log in
        </Link>
      </div>
      
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8">
        {/* Manual Signup */}
        <ManualSignupForm />
        
        <div className="my-8 flex items-center w-full max-w-4xl mx-auto">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* OAuth Signup/Login Option */}
        <div className="flex flex-col items-center">
          <p className="text-gray-600 mb-4">Sign up instantly with your existing accounts</p>
          <div className="flex justify-center w-full max-w-md border border-gray-200 rounded-lg p-6 bg-gray-50">
             <OAuthLogin />
          </div>
        </div>
      </div>
    </main>
  );
}
