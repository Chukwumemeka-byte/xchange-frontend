/**
 * FHIR R4 Typed Interfaces for COREX Xchange
 * Based on backend mappings in backend/fhir/mappings/
 */

export type ResourceType =
  | "Patient"
  | "Encounter"
  | "Immunization"
  | "Location"
  | "Organization"
  | "Consent"
  | "AuditEvent"
  | "Bundle"
  | "OperationOutcome";

export interface BaseResource {
  resourceType: ResourceType;
  id: string;
  meta?: {
    lastUpdated?: string;
    profile?: string[];
  };
}

export interface Identifier {
  system: string;
  value: string;
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface CodeableConcept {
  coding: Coding[];
  text?: string;
}

export interface Reference {
  reference: string;
  display?: string;
}

export interface Extension {
  url: string;
  valueString?: string;
  valueBoolean?: boolean;
}

// --- Specific Resources ---

export interface Patient extends BaseResource {
  resourceType: "Patient";
  identifier: Identifier[];
  active: boolean;
  name: Array<{
    family: string;
    given: string[];
  }>;
  gender: "male" | "female" | "other" | "unknown";
  birthDate?: string;
  telecom?: Array<{ system: string; value: string }>;
  extension?: Extension[];
  link?: Array<{
    other: Reference;
    type: "refer" | "seealso" | "replaced-by" | "replaces";
  }>;
}

export interface Location extends BaseResource {
  resourceType: "Location";
  identifier: Identifier[];
  status: "active" | "inactive" | "suspended";
  name: string;
  mode: "instance" | "kind";
  type: CodeableConcept[];
  address: {
    state?: string;
    district?: string;
    text: string;
  };
  position?: {
    latitude: number;
    longitude: number;
  };
}

export interface Encounter extends BaseResource {
  resourceType: "Encounter";
  status: "planned" | "arrived" | "triaged" | "in-progress" | "onleave" | "finished" | "cancelled";
  class: Coding;
  subject: Reference;
  period: { start: string; end?: string };
  serviceType?: CodeableConcept;
  location?: Array<{ location: Reference }>;
  hospitalization?: { dischargeDisposition: { text: string } };
  serviceProvider?: Reference;
}

export interface Immunization extends BaseResource {
  resourceType: "Immunization";
  status: "completed" | "entered-in-error" | "not-done";
  vaccineCode: CodeableConcept;
  patient: Reference;
  occurrenceDateTime: string;
  site?: { text: string };
  protocolApplied?: Array<{ doseNumberString: string }>;
  reportOrigin?: { text: string };
  performer?: Array<{ actor: Reference }>;
}

export interface Organization extends BaseResource {
  resourceType: "Organization";
  identifier: Identifier[];
  active: boolean;
  name: string;
  telecom: Array<{ system: "email" | "phone"; value: string }>;
}

export interface Bundle<T = BaseResource> extends BaseResource {
  resourceType: "Bundle";
  type: "searchset" | "transaction" | "batch" | "transaction-response" | "batch-response";
  total?: number;
  link?: Array<{ relation: string; url: string }>;
  entry: Array<{
    fullUrl: string;
    resource: T;
    search?: { mode: "match" | "include" | "outcome" };
  }>;
}

export interface OperationOutcome extends BaseResource {
  resourceType: "OperationOutcome";
  issue: Array<{
    severity: "fatal" | "error" | "warning" | "information";
    code: string;
    diagnostics?: string;
  }>;
}
