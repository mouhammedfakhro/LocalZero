import Image from "next/image";
import AuthTabs from '@/app/components/AuthTabs';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome to LocalZero</h1>
          <p className="text-muted-foreground">
            Collaborate with neighbors on eco-friendly initiatives
          </p>
        </div>
        <AuthTabs />
      </div>
    </div>
  );
}
