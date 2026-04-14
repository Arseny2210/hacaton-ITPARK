export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  ai_response: string | null;
  ai_method: string | null;
  created_at: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
}

export interface UpdateStatusPayload {
  status: 'open' | 'in_progress' | 'closed';
}