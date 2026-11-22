"use client";
import { useSearchParams } from "next/navigation";
import { DEMO_FIELDS, LeadForm } from "./LeadForm";

/** Contact form (saved to Admin > Leads). Preselects the topic from ?course=… if given. */
export function DemoForm() {
  const course = useSearchParams().get("course");
  const fields = DEMO_FIELDS.map((f) => (f.name === "course" && course && f.options?.includes(course) ? { ...f, defaultValue: course } : f));
  return <LeadForm key={course ?? "none"} kind="demo" fields={fields} submitLabel="Send message" successText="Thank you. We will get back to you shortly." />;
}
