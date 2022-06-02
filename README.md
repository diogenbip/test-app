# test-app
setup:

npm install 
npm config set legacy-peer-deps true 
lerna bootstrap --hoist 
npm run start 

(on Windows) for stop: npm run kill-ports 

setup blockchain:

change the current working directory to blockchain dir 
npm install 
npx hardhat compile 
npx hardhat test 

server folder:
test-app (Nest JS)
client folder:
test-react-app (React APP)
blockchain folder:
blockchain (Hardhat, uniswap)

p.s. Service sendgrid was added as example (it will work with api_key of sendgrid).A real mail service use smtp of mail.ru and nodemailer. Sendgrid (and services like sendgrid too) did not allow to register
p.s.s. Blockchain sample-test.js add and remove liquidity correctly with local coins. 
