'use client'

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

export function SubmitButton({children}:PropsWithChildren) {
  const { pending } = useFormStatus();

  <Button type='submit' aria-disabled={pending} className='w-full mt-2'>
    {pending ? "Submitting..." : children}
  </Button>
}