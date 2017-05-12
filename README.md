# Door-Access
To Test locally:

1-Clone this repo
mkdir door
cd door
git clone https://github.com/Makersmiths/Door-Access.git .

2-Modify the Server.js file, comment out he two lones where the Raspeberry Pi ports are being used

3-create a config folder
mkdir config

4-Copy the default.json into the "config" folder

5-Install dependencies
npm install

6-Start the server
npm start

7-open a browser and point it to the server running on port 3000
a) the default path should display a message that says the site is private
b) to open the door use: /open/1234567890   where the number is your phone number with no parenthesis or dashes or spaces, they will be macthed directly to the info in the default.json file

Note:
If you do not get a text with the PIN to access, you should still be able to test this by using the PIN printed on the server log.
