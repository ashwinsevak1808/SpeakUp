"use client";
import { useSearchParams } from "next/navigation";
import { DEMO_FIELDS, LeadForm } from "./LeadForm";

/** Demo-booking form. Preselects the course from ?course=… (set by every "Enroll" button). */
export function DemoForm() {
  const course = useSearchParams().get("course");
  const fields = DEMO_FIELDS.map((f) => (f.name === "course" && course && f.options?.includes(course) ? { ...f, defaultValue: course } : f));
  return <LeadForm key={course ?? "none"} kind="demo" fields={fields} submitLabel="Book My Free Demo" successText="Thank you. We will call you shortly to confirm your demo class." />;
}
