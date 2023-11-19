import { type UUID } from "crypto";

export interface IUserLanguages {
  user_id: UUID
  language: string
  country_code_name: string
  is_archived: boolean
}