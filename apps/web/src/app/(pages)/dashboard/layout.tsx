import { ChatWSProvider } from "@/components/providers/ChatWSProvider";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  <div className="w-full h-full">
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
    <div className="flex flex-col gap-12 h-full w-full p-4 ">
      <div className="h-16 w-full flex-shrink-0">
        <TopBar />
      </div>
      <div className="flex flex-1 overflow-hidden gap-12">
        <div className="w-1/3 flex-shrink-0">
          <Sidebar
            friends={[
              {
                name: 'Jay123',
                id: '22',
                isOnline: true,
                latestChat: "Bro the baddies were not letting me hit last night it was so fkn annoying"
              },
              {
                name: 'Nigg00',
                id: '3',
                isOnline: false,
                latestChat: "Bro the baddies were not letting me hit last night it was so fkn annoying"
              }
            ]}
          />
        </div>
        <div className="flex-1 overflow-auto rounded-2xl border-[2px] border-white bg-[rgba(255,255,255,0.5)]">
          <ChatWSProvider>
            {children}
          </ChatWSProvider>
        </div>
      </div>
    </div>
  </div>
}