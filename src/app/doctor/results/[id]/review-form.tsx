"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ClipboardCheck, Loader2 } from "lucide-react";

import { updateResultReview } from "@/lib/actions";
import type { PatientResult } from "@/lib/dal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { FormEvent } from "react";

export function ReviewForm({ result }: { result: PatientResult }) {
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState(result.diagnosis);
  const [status, setStatus] = useState<string>(result.status || "PENDING_REVIEW");
  const [notes, setNotes] = useState<string>(result.doctor_notes ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction, isSubmitting] = useActionState(updateResultReview, { message: "" });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (formState.message.length > 0) {
      if (formState.success ?? false) {
        toast({
          title: "Success",
          description: formState.message,
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: formState.message,
          variant: "destructive",
        });
      }
    }
  }, [formState, toast, router]);

  useEffect(() => {
    if (open) {
      setDiagnosis(result.diagnosis);
      setStatus(result.status || "PENDING_REVIEW");
      setNotes(result.doctor_notes ?? "");
    }
  }, [open, result]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      if (formRef.current == null) return;
      formAction(new FormData(formRef.current));
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ClipboardCheck className="size-4" />
          Review Result
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Clinical Review</DialogTitle>
          <DialogDescription>
            Verify or revise the diagnostic classification, record clinical findings, and finalize
            the diagnostic status.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="result_id" value={result.result_id} />
          <input type="hidden" name="status" value={status} />

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <div className="flex gap-2">
              <Input
                id="diagnosis"
                name="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Healthy, Infected, PCOS"
                required
              />
              <Select value={diagnosis} onValueChange={(val) => setDiagnosis(val)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Infected">Infected</SelectItem>
                  <SelectItem value="PCOS">PCOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Select a preset classification or enter a specific diagnostic revision.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-select">Review Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Select review status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="REVISED">Revised</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Mark as &apos;Verified&apos; if confirmed, or &apos;Revised&apos; if the diagnosis was
              modified.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor_notes">Doctor Clinical Notes</Label>
            <Textarea
              id="doctor_notes"
              name="doctor_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical commentary, follicle counts, Rotterdam criteria, or treatment suggestions..."
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              Maximum 2000 characters. These notes will be included in clinical summaries.
            </p>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
