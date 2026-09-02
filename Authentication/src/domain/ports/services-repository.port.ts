import { ServicesRequest, ServicesResponse } from "../models/services.models";

export interface ServicesRepositoryPort {

  create(client: ServicesRequest): Promise<boolean>;
  list(): Promise<ServicesResponse[]>;
  findById(Id: string): Promise<ServicesResponse | null>;
}