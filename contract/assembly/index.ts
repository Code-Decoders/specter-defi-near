import {
  Context,
  logging,
  storage,
  u128,
  util,
  ContractPromiseBatch,
} from "near-sdk-as";
import { LocalStorage, userStorage } from "./model";

const BORROW_APY = u128.from(0.1);
const DEPOSIT_APY = u128.from(0.05);

export function lend(): void {
  const accountId = Context.sender;
  const amount = Context.attachedDeposit;
  assert(amount.pos(), "amount must be greater than 0");

  logging.log(`Lending ${amount} to account "${accountId}"`);
  const user = userStorage.get(accountId);
  if (user) {
    userStorage.set(
      accountId,
      new LocalStorage(u128.add(user.totalDeposits, amount), user.totalBorrows)
    );
  } else {
    userStorage.set(accountId, new LocalStorage(u128.from(0), u128.from(0)));
  }
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  if (marketSize) {
    let marketCap = u128.add(marketSize, amount);
    storage.set("marketSize", marketCap);
  }
}

export function withdraw(amount: u128): void {
  const accountId = Context.sender;
  const user = userStorage.get(accountId);
  logging.log(`Withdrawing ${amount} from account "${accountId}"`);
  const amountWithInterest = u128.add(amount, u128.mul(amount, DEPOSIT_APY));
  if (user) {
    logging.log(`Sending to ${accountId}`);
    ContractPromiseBatch.create(Context.sender).transfer(amountWithInterest);
    userStorage.set(
      accountId,
      new LocalStorage(u128.sub(user.totalDeposits, amount), user.totalBorrows)
    );
  } else {
    userStorage.set(accountId, new LocalStorage(u128.from(0), u128.from(0)));
  }
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  if (marketSize) {
    let marketCap = u128.sub(marketSize, amountWithInterest);
    storage.set("marketSize", marketCap);
  }
}

export function borrow(amount: u128): void {
  const accountId = Context.sender;
  const user = userStorage.get(accountId);
  ContractPromiseBatch.create(Context.sender).transfer(amount);
  logging.log(`Borrowing ${amount} for account "${accountId}"`);
  if (user) {
    userStorage.set(
      accountId,
      new LocalStorage(user.totalDeposits, u128.add(user.totalBorrows, amount))
    );
  } else {
    userStorage.set(
      accountId,
      new LocalStorage(u128.from(0), u128.add(u128.from(0), amount))
    );
  }
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  if (marketSize) {
    let marketCap = u128.sub(marketSize, amount);
    storage.set("marketSize", marketCap);
  }
}

export function repay(): void {
  const accountId = Context.sender;
  const amount = Context.attachedDeposit;
  logging.log(`Repaying ${amount} from account "${accountId}"`);
  const originalAmount = u128.div(amount, u128.add(u128.from(1), BORROW_APY));
  const user = userStorage.get(accountId);
  if (user) {
    userStorage.set(
      accountId,
      new LocalStorage(user.totalDeposits, u128.sub(user.totalBorrows, amount))
    );
  } else {
    userStorage.set(accountId, new LocalStorage(u128.from(0), u128.from(0)));
  }
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  if (marketSize) {
    let marketCap = u128.add(marketSize, originalAmount);
    storage.set("marketSize", marketCap);
  }
}

export function getUser(accountId: string): LocalStorage | null {
  const user = userStorage.get(accountId);
  if (user) {
    logging.log(
      `Account "${accountId}" has ${user.totalDeposits} and ${user.totalBorrows}`
    );
    return user;
  } else {
    logging.log(`Account "${accountId}" does not exist`);
    return null;
  }
}

export function getMarketSize(): u128 | null {
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  // logging.log(`Market size is ${marketSize}`);
  return marketSize;
}
