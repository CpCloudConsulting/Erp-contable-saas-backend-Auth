import { ClientRequest, ClientResponse } from "../models/client.models";


export interface ClientRepositoryPort {

  findByEmail(email: string): Promise<boolean>;
  create(client: ClientRequest): Promise<boolean>;
  findByDocumentId(DocumentId: string): Promise<boolean>;
}