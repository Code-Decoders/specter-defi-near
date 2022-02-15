import { u128, PersistentMap } from "near-sdk-as";

@nearBindgen
export class LocalStorage {
  totalDeposits: u128;
  totalBorrows: u128;
  constructor(deposits: u128, borrows: u128) {
    this.totalDeposits = deposits;
    this.totalBorrows = borrows;
  }
}

export const userStorage = new PersistentMap<string, LocalStorage>(
  "userStorage"
);
