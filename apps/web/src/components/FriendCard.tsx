
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// export function FriendCard({ name, latestChat, isOnline }: {name:string, latestChat:string, isOnline: boolean}) {
//   return (
//     <Card className="w-full max-w-sm flex flex-col gap-12">
//       <CardHeader>
//         <CardTitle className="mb-2">{name}</CardTitle>
//         <CardDescription className="text-muted-foreground">
//           {latestChat.length > 50 ? latestChat.slice(0, 50) + '...' : latestChat}
//         </CardDescription>
//       </CardHeader>
//     </Card>
//   )
// }

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export function FriendCard({ name, id, latestChat, isOnline }: {name:string, id:string, latestChat:string, isOnline: boolean}) {
  return (
    <Link
      className="hover:cursor-pointer"
      href={`/dashboard/${id}`}
    >
      <div className="relative">
        {/* Main card with simple glass effect */}
        <Card 
          className={`
            relative w-full max-w-sm flex flex-col gap-12 overflow-hidden
            backdrop-blur-md border-white/20 border-[2px] shadow-lg transition-all duration-700 hover:scale-[1.02]
            ${isOnline 
              ? 'bg-[rgba(255,255,255,0.8)]' 
              : 'bg-[rgba(255,255,255,0.3)]'
            }
          `}
        >

          {/* Online status indicator */}
          <div className="absolute top-4 right-4">
            <div 
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${isOnline 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50 animate-pulse' 
                  : 'bg-gradient-to-r from-gray-400 to-slate-500 shadow-sm shadow-gray-400/30'
                }
              `}
            />
            {isOnline && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75" />
            )}
          </div>

          <CardHeader className="relative z-10">
            <CardTitle 
              className={`
                mb-2 transition-all duration-500 font-semibold
                ${isOnline 
                  ? 'text-slate-900' 
                  : 'text-slate-600'
                }
              `}
            >
              {name}
            </CardTitle>
            <CardDescription 
              className={`
                transition-all duration-500
                ${isOnline 
                  ? 'text-slate-700' 
                  : 'text-slate-500'
                }
              `}
            >
              {latestChat.length > 50 ? latestChat.slice(0, 50) + '...' : latestChat}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Link>
  )
}
