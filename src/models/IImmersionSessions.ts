import type { UUID } from "crypto";

export interface IImmersionSessions {
  id: number;
  immersion_date: Date;
  immersion_type: string;
  active_type: string;
  content_type: string;
  content_name: string;
  seconds_immersed: number;
  user_id: UUID;
}
