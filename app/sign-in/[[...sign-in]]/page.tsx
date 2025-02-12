import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="pb-10">
        <h3 className="text-lg">Try Demo</h3>
        <p>
          Email: <span>test@gmail.com</span>
        </p>
        <p>
          Password: <span>Aj#1ZFe5GC</span>
        </p>
      </div>
      <SignIn forceRedirectUrl={"/dashboard"} />
    </div>
  );
}
