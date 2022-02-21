![https://specter-defi.netlify.app/](https://user-images.githubusercontent.com/22388017/153361113-e692b046-dbcc-4d61-b430-394a18f7f019.png)

> WARNING: This project is for testing purposes only, this is not by any means is a production-level code.

### Checkout Specter DeFi by visiting:
### https://specter-near.netlify.app
###### Special instructions: Please make sure to run this website on [google chrome](https://www.google.com/chrome/?brand=FHFK&gclid=Cj0KCQiAjJOQBhCkARIsAEKMtO340I7QAqj4f4aqz66DT7Ow74cSK-4a0zoFKXNDQHJWcXr0xeji5soaAvXlEALw_wcB&gclsrc=aw.ds) and you have the [Algosigner](https://www.purestake.com/technology/algosigner/) extension installed.

---

### `Project Overview:`
Just like conventional peer–to–peer lending and borrowing platforms, Specter DeFi facilitates its users to lend their ALGO to others and borrow it from the protocol pool.
In exchange, the lender gets interest payments. Specter DeFi operates without any middlemen, hence, the financial rewards are sent straight away to the users. The best thing about using Specter DeFi is that the users don’t ever need to disclose their identity, and still borrow or lend ALGOs.

### For more details please check out the complete walkthrough here,



https://user-images.githubusercontent.com/22388017/154958727-1b1f15a1-285a-4024-8e1e-73cadf1c6635.mp4



---

### `How does Specter DeFi  work?`
1. Lending:
The lender sends a lending request to the smart contract and then those funds get stored in the blockchain with the contract. When the lender wishes to withdraw his funds, he can send a withdrawal request to the contract and receive the funds with the interest rewards.
2. Borrowing:
The borrowers send a borrow request to the smart contract and those funds are transferred to the user in return. The user can repay the funds by sending a repay request, but this time the user would also have to provide the payment with the interest added.
Note: Since this is still an in-development project, we do not take any collateral, when providing funds to the borrow, this would be added in the future.

---

### `Tech Stack`
* React JS (Frontend)
* AssemblyScript (Smart Contract)
* Near Account (Signing Transactions)
* Figma (UI Design)

--- 

### `Steps to run the project`
After downloading and opening code in your IDE,
### `Step 1:`
Make sure to add [Algosigner](https://www.purestake.com/technology/algosigner/) extension in chrome browser.


### `Step 2:`
Then get your ```API SECRET``` by taping on [this button](https://developer.purestake.io/signup) and following instructions there.

![image](https://user-images.githubusercontent.com/22388017/153376786-7e921cc5-0593-4323-ab3f-0ad6f6813670.png)

### `Step 3:`
Open ```contract_adaptor.js``` and put ```API SECRET``` you are provided from Algosigner, on lines [number 8](https://github.com/Code-Decoders/specter-defi-algo/blob/dda90b8a0640f59d33cc26cb0d66fd3175ccc7c8/src/adaptor/contract_adaptor.js#L8).

![image](https://user-images.githubusercontent.com/22388017/153430779-1ac90920-69e4-4672-80f6-ff1d1a374811.png)

### `Step 4:`
Follow the [@uauth/js](https://www.npmjs.com/package/@uauth/js) documentation and get ```CLIENT_ID```, ```CLIENT_SECRET``` and a ```REDIRECT_URI```. Once you have these values, open ```HomePage.jsx``` replace on lines [18, 19, 20](https://github.com/Code-Decoders/specter-defi-algo/blob/dbf23c3ddc60c65ee288b7a7b3c04356f852b009/src/pages/HomePage.jsx#L17) respectively.

![image](https://user-images.githubusercontent.com/22388017/153379642-ef776495-229c-4929-a899-f1fbe24060a4.png)

### `Step 5:`
run `npm i` in the terminal.

### `Step 6:`
run `npm start`.

---

# Thank you for making it this far, have a good day! :coffee:
