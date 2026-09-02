import { StylistRequest, StylistResponse } from "../models/stylist.models";

export interface StylistRepositoryPort {

  findByEmail(email: string): Promise<boolean>;
  create(user: StylistRequest): Promise<boolean>;
  list(): Promise<StylistResponse[]>;
  findByDocumentId(DocumentId: string): Promise<StylistResponse>;
}