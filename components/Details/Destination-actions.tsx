"use client"

import { useState, useTransition } from "react"
import { Loader2, Pencil, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { Destination } from "@/lib/destinations"
import EditDestinationDialog from "./Edit-destination-dialog"
import { deleteDestination } from "@/lib/actions-destination"

export default function DestinationActions({
  destination,
}: {
  destination: Destination
}) {
  const { id, title } = destination
  const [editOpen, setEditOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const confirmDelete = () => {
    setError("")
    startTransition(async () => {
      const res = await deleteDestination(id)
      if (res?.error) setError(res.error) // on success the action redirects
    })
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="group h-9 gap-2 px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1a9fc0] hover:bg-[#1a9fc0] hover:text-white hover:shadow-md hover:shadow-[#1a9fc0]/30"
        >
          <Pencil className="size-3.5 transition-transform duration-300 group-hover:rotate-12" />
          Edit
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="group h-9 gap-2 border-red-300 px-4 text-red-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30"
        >
          <Trash2 className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
          Delete
        </Button>
      </div>

      <EditDestinationDialog
        key={`${destination.id}-${editOpen}`}
        destination={destination}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={open} onOpenChange={(v) => !pending && setOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the travel package. This action can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={pending}
              className="gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}