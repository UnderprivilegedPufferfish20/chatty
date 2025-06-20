import { ChatWSProvider } from "@/components/providers/ChatWSProvider";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { getUserFriends } from "@/lib/helpers";
import { getSession } from "@/lib/session";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    throw new Error("Dashboard - no session found");
  }

  const usersFriends = await getUserFriends(session.user.id);

  return (
    <div className="w-full h-full">
      <ChatWSProvider>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <Image
            src="/chatty_bg.jpg"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL="/your-background-blur.jpg"
            className="w-full h-full object-cover filter blur-xs scale-110"
            priority
          />
        </div>
        
        {/* Main Layout */}
        <div className="flex flex-col gap-12 h-full w-full p-4">
          {/* Top Bar */}
          <div className="h-16 w-full flex-shrink-0">
            <TopBar userName={session.user.name} />
          </div>
          
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden gap-12">
            {/* Sidebar */}
            <div className="w-1/3 flex-shrink-0">
              <Sidebar
                friends={usersFriends.map(f => ({
                  name: f.name,
                  id: f.id,
                  latestChat: f.latestChat
                }))}
              />
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-auto rounded-2xl border-[2px] border-white bg-[rgba(255,255,255,0.5)]">
              {children}
            </div>
          </div>
        </div>
      </ChatWSProvider>
    </div>
  );
}