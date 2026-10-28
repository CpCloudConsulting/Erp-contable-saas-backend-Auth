import { LocationResponse } from "../models/location.models";

export interface LocationRepositoryPort {

    list(): Promise<LocationResponse[]>;
}