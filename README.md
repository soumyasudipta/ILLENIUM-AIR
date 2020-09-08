# ILLENIUM AIR

A retail shopping project to make your life easier.

---
## Requirements

For development, you will only need Node.js and a node global package,  installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    $ npm --version

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

I recommend to install nodemon as global dependency using this command.

    $ npm install -g nodemon

## Install

    $ git clone https://github.com/soumyasudipta/ILLENIUM-AIR
    $ cd ILLENIUM AIR
    $ npm install
    $ npm client-install

## Configure app

Open `config/keys.js` then edit it with your settings. You will need:

- Add a mongodb url
- Add a secret key

## Running the project

    $ npm run dev

This command will run the development server on localhost:3000.

As the main objective of the project is to run on mobile phones. The camera functionality in laptop is not accessible as it is set to the back camera.

To be able to run the project in mobile version make sure that your laptop and phone is connected to same wifi network and follow the below steps.

## Settings for chrome mobile

To ignore Chrome’s secure origin policy, follow these steps. Navigate to
- `chrome://flags/`
and search for `Insecure origins treated as secure` and enable it. 

Inside the text box write 
`http://<YOUR LAPTOP'S IPv4 ADDRESS>:3000` 

Once you finish typing chrome will ask you to relaunch, accept it.

Then go to the url `http://<YOUR LAPTOP'S IPv4 ADDRESS>:3000` to enjoy the functionality.