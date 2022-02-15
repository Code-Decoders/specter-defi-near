import {
  Context,
  logging,
  storage,
  u128,
  ContractPromiseBatch,
} from "near-sdk-as";
import { LocalStorage, userStorage } from "./model";

const BORROW_APY = u128.from(0.1);
const DEPOSIT_APY = u128.from(0.05);

export function lend(): void {
  const accountId = Context.sender;
  const amount = Context.attachedDeposit;
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

export function withdraw(amount: string): void {
  const accountId = Context.sender;
  const user = userStorage.get(accountId);
  logging.log(`Withdrawing ${u128.from(amount)} from account "${accountId}"`);
  if (user) {
    logging.log(`Sending to ${accountId}`);
    ContractPromiseBatch.create(Context.sender).transfer(u128.from(amount));
    userStorage.set(
      accountId,
      new LocalStorage(u128.sub(user.totalDeposits, u128.from(amount)), user.totalBorrows)
    );
  } else {
    userStorage.set(accountId, new LocalStorage(u128.from(0), u128.from(0)));
  }
  let marketSize: u128 | null = storage.get<u128>("marketSize");
  if (!marketSize) marketSize = u128.from(0);
  if (marketSize) {
    let marketCap = u128.sub(marketSize, u128.from(amount));
    storage.set("marketSize", marketCap);
  }
}

export function borrow(amount: u128): void {
  const accountId = Context.sender;
  const user = userStorage.get(accountId);
  ContractPromiseBatch.create(Context.sender).transfer(amount);
    logging.log(`Borrowing ${amount} for account "${accountId}"`);
  // userStorage.set(
  //   accountId,
  //   new LocalStorage(
  //     user!.totalDeposits || u128.from(0),
  //     u128.add(user!.totalBorrows || u128.from(0), u128.from(amount))
  //   )
  // );
  // storage.set(
  //   "marketSize",
  //   u128.sub(
  //     storage.get<u128>("marketSize")! || u128.from(0),
  //     u128.from(amount)
  //   )
  // );
}

export function repay(): void {
  const accountId = Context.sender;
  const amount = Context.attachedDeposit;
  logging.log(`Repaying ${amount} from account "${accountId}"`);
  const user = userStorage.get(accountId);
  userStorage.set(
    accountId,
    new LocalStorage(
      user!.totalDeposits || u128.from(0),
      u128.sub(user!.totalBorrows || u128.from(0), u128.from(amount))
    )
  );
  storage.set(
    "marketSize",
    u128.add(storage.get<u128>("marketSize")! || u128.from(0), amount)
  );
}

export function getUser(accountId: string): void {
  const user = userStorage.get(accountId);
  if (user)
    logging.log(
      `Account "${accountId}" has ${user.totalDeposits} and ${user.totalBorrows}`
    );
  else logging.log(`Account "${accountId}" does not exist`);
}
