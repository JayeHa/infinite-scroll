import axios from "axios";
import { User } from "../model/user";
import { PaginationParams, PaginationResponse } from "../types/server";

export const fetchUsers = (params: PaginationParams) =>
  axios.get<PaginationResponse<User>>("/users", {
    params,
  });
