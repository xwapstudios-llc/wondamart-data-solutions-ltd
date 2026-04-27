export interface AgentStore {
  store_id: string,
  agent_id: number,
  name: string,
  email?: string,
  phone_number?: string,
  is_phone_on_whatsapp?: boolean,
  bundles: Object,
  is_active: boolean,
  opening_time?: string,
  closing_time?: string,
  created_at?: string,
  updated_at?: string,
}
