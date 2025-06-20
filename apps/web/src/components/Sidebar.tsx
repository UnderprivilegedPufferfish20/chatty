"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useMemo, useState } from "react"
import { FriendCard } from './FriendCard'
import Image from "next/image"
import GenericIcon from "./Icon"
import { useSocket } from "./providers/ChatWSProvider"

export function Sidebar({ friends }: { friends: {name:string, id:string, latestChat:string, pfpUrl?: string}[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [idsOfOnline, setIdsOfOnline] = useState<string[]>([])

  // Get socket - but don't return early yet
  const socket = useSocket();

  // Debug: Log socket connection status
  useEffect(() => {
    if (socket) {
      console.log('Socket connected:', socket.connected);
      console.log('Current friends:', friends.map(f => ({ id: f.id, name: f.name })));
    }
  }, [socket, friends]);

  // Call ALL hooks before any conditional returns
  useEffect(() => {
    // Only set up listeners if socket exists
    if (!socket) return;

    // Add cleanup for event listeners
    const handleUserOnline = (data: { id: string }) => {
      console.log('User came online:', data); // Debug log
      if (friends.map(f => f.id).includes(data.id)) {
        setIdsOfOnline(prev => {
          // Prevent duplicates
          if (prev.includes(data.id)) return prev;
          console.log('Adding online user:', data.id); // Debug log
          return [...prev, data.id];
        });
      }
    };

    const handleUserLoggedOff = (data: { id: string }) => {
      console.log('User went offline:', data); // Debug log
      setIdsOfOnline(prev => {
        if (prev.includes(data.id)) {
          console.log('Removing offline user:', data.id); // Debug log
          return prev.filter(id => id !== data.id);
        }
        return prev;
      });
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_logged_off', handleUserLoggedOff);

    // Cleanup listeners on unmount
    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_logged_off', handleUserLoggedOff);
    };
  }, [socket, friends]); // Removed idsOfOnline from dependencies to prevent re-registering listeners

  const sortedFriends = useMemo(
    () => friends.slice().sort((a, b) => (idsOfOnline.includes(b.id) === idsOfOnline.includes(a.id) ? 0 : idsOfOnline.includes(b.id) ? 1 : -1)),
    [friends, idsOfOnline] // Added idsOfOnline to dependencies
  )

  const filteredFriends = useMemo(() => {
    if (!searchTerm.trim()) return sortedFriends
    return sortedFriends.filter(friend => 
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [sortedFriends, searchTerm])

  // NOW we can handle the loading state after all hooks are called
  if (!socket) {
    return (
      <Card className="w-full bg-[rgba(255,255,255,0.5)] border-[2px] border-white">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Connecting to chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[rgba(255,255,255,0.5)] border-[2px] border-white">
      <CardContent>
        
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl font-bold">Friends</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <GenericIcon name="search"/>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Search for Friends</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="search-name">Name</Label>
                        <div className="relative">
                          <Input 
                            id="search-name" 
                            name="search-name" 
                            placeholder="Enter friend's name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10"
                          />
                        </div>
                      </div>
                      
                      {/* Search Results */}
                      <div className="max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {searchTerm.trim() && filteredFriends.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No friends found matching "{searchTerm}"
                            </p>
                          ) : searchTerm.trim() ? (
                            filteredFriends.map(f => (
                              <FriendCard 
                                name={f.name}
                                latestChat={f.latestChat}
                                isOnline={idsOfOnline.includes(f.id)}
                                id={f.id}
                                key={f.id}
                              />
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Start typing to search for friends...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Main Friends List */}
                <div className="mt-4 flex flex-col gap-3 w-full">
                  {sortedFriends.map(f => (
                    <FriendCard 
                      key={f.id}
                      name={f.name}
                      isOnline={idsOfOnline.includes(f.id)}
                      latestChat={f.latestChat}
                      id={f.id}
                    />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}