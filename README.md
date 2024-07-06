# How to run this app

1. Clone the repo:
 
    `git clone git@github.com:jameslcarpino/workOS.git`

3. Install packages: `npm install`
   
4. Add an `.env` file to this project and add the following values (after this assessment has been reviewed I will be removing this intentional secret key leak):
   ```
    WORKOS_API_KEY=sk_test_a2V5XzAxSjIwNDVLMUJGUkpRV05IMktBWkdLWDIzLFlXUTMyTlp6b3BpWk8xSlNmWUlKazdXTFg
    WORKOS_CLIENT_ID=client_01J2045KEKZAZ2KEHKBCSTB8NY

5. Make sure you're in the project workOS directory and start the app: `npm start`   
   
6. Open a browser window and go to `http://localhost:8000`
   
7. Log in via Okta with the test user credentials:
   ```
   username: testingEmail@github.oktaidp
   password: TeP179109!

   or

   username: kingUnderDaMountain@github.oktaidp
   password: noDragonspleases

8. Once logged in, you can navigate the user flow:
   
    Successful Login page -> Directory page -> Users page -> Back as needed.

9.  If you go to the page Answered Questions, you'll see a pdf of the customer responses.

10. Have fun! :) 