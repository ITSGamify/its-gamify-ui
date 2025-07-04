import { OrderDirection } from "./query";

export type TableColumns = Array<{
  column: string | null;
  direction: OrderDirection | null;
}>;
