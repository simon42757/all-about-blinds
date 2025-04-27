// Job and related types
export interface Job {
  id: string;
  name: string;
  organisation: string;
  address: string;
  area: string;
  postcode: string;
  status?: 'active' | 'completed' | 'cancelled'; // Job status
  aoi?: string; // Area of Interest/Additional Information
  contacts: Contact[];
  surveys: Survey[];
  tasks: Task[];
  rollerBlinds: RollerBlind[];
  verticalBlinds: VerticalBlind[];
  venetianBlinds: VenetianBlind[];
  costSummary: CostSummary;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  organisation?: string;
  address?: string;
  area?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  isMainContact?: boolean;
  role?: string;
  notes?: string;
  aoi?: string;
}

export interface Survey {
  id: string;
  brief?: string;
  date: string;
  time?: string;
  surveyorName?: string;
  findings?: string;
  followUpActions?: string;
  aoi?: string;
}

export interface Task {
  id: string;
  description: string;
  cost: number;
  status?: string;
  dueDate?: string;
  assignedTo?: string;
  notes?: string;
  aoi?: string;
}

export interface BlindBase {
  id: string;
  location: string;
  width: number; // in mm
  drop: number; // in mm
  quantity: number;
  cost: number;
  aoi?: string;
}

export interface RollerBlind extends BlindBase {}
export interface VerticalBlind extends BlindBase {}
export interface VenetianBlind extends BlindBase {}

export interface CostSummary {
  subtotal: number;
  carriage: number;
  fastTrack: number;
  vat: number;
  vatRate: number;
  profit: number;
  profitRate: number;
  total: number;
  additionalCosts: AdditionalCost[];
  documentDate?: string; // Custom date for quotes, invoices and receipts
}

export interface AdditionalCost {
  id: string;
  description: string;
  amount: number;
}

// Form state interfaces
export interface JobFormState {
  name: string;
  organisation: string;
  address: string;
  area: string;
  postcode: string;
  status: 'active' | 'completed' | 'cancelled';
  aoi: string;
}

export interface ContactFormState {
  name: string;
  organisation: string;
  address: string;
  area: string;
  postcode: string;
  phone: string;
  email: string;
  isMainContact: boolean;
  aoi: string;
}

export interface SurveyFormState {
  brief: string;
  date: string;
  time: string;
  aoi: string;
}

export interface TaskFormState {
  description: string;
  cost: number;
  aoi: string;
}

export interface BlindFormState {
  location: string;
  width: number;
  drop: number;
  quantity: number;
  cost: number;
  aoi: string;
}

export interface CostSummaryFormState {
  carriage: number;
  fastTrack: number;
  vatRate: number;
  profitRate: number;
  documentDate: string; // Custom date for documents
  additionalCosts: {
    description: string;
    amount: number;
  }[];
}
