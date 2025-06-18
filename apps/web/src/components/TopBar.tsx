import { getSession } from '@/lib/session'
import React from 'react'
import { AnonymousUserIcon } from './ui/DefaultUser'
import { AddFriendButton } from './AddFriendButton'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const TopBar = async () => {

  // const session = await getSession()
  // if (!session) throw new Error()
  

  return (
    <div className='w-full p-4 flex items-center justify-between bg-[rgba(255,255,255,0.5)] rounded-xl border-[2px] border-white'>
      <Dialog>
        <form className='pl-6'>
          <DialogTrigger asChild>
            <div className='hover:border-[3px] hover:border-gray-400 rounded-full'>

              <AnonymousUserIcon size={48}/>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input id="username-1" name="username" defaultValue="@peduarte" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <p
        className='text-6xl font-extrabold text-gray-400'
      >Chatty</p>
      <AddFriendButton />
    </div>
  )
}