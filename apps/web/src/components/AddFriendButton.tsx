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

import GenericIcon from "./Icon"
import FriendCodeOTP from "./FriendCodeOTP"

export function AddFriendButton() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-3">
            Add Friends
            <GenericIcon name="add"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Code</DialogTitle>
            <DialogDescription>
              Enter the 6-digit friend code provided by your soon-to-be friend
            </DialogDescription>
          </DialogHeader>
            <FriendCodeOTP />
        </DialogContent>
      </form>
    </Dialog>
  )
}
