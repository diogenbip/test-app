# test-app

<b>setup:</b>

npm install <br />
npm config set legacy-peer-deps true <br />
lerna bootstrap --hoist <br />
npm run start <br />

<b>(on Windows) for stop:</b>

npm run kill-ports <br />

<b>setup blockchain:</b>

change the current working directory to blockchain dir <br />
npm install <br />
npx hardhat compile <br />
npx hardhat test <br />

<b>server folder:</b>
test-app (Nest JS)
<b>client folder:</b>
test-react-app (React APP)
<b>blockchain folder:</b>
blockchain (Hardhat, uniswap)

<b>P.S.</b> Service sendgrid was added as example (it will work with api_key of sendgrid).A real mail service use smtp of mail.ru and nodemailer. Sendgrid (and services like sendgrid too) did not allow to register</br>
<b>P.S.S.</b> Blockchain sample-test.js add and remove liquidity correctly with local coins. 
