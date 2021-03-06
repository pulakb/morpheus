# morpheus

#### Description

Node server will use Rovi APIs to fetch meta data and will store them in MongoDB.

#### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
node-rovi/
  |- src/
  |  |- config/
  |  |  |- index.js
  |  |- lib/
  |  |  |- model/
  |  |  |   |-collectionDriver.js
  |  |  |- module
  |  |  |   |-index.js
  |  |- node_modules/
  |  |  |- <node modules for the project>
  |  |- index.js/
  |  |- package.json
  |- .gitignore
```

#### Quick Start

Install Node.js and then:

```
$ git clone https://github.com/pulakb/morpheus.git
$ cd morpheus
$ cd src
$ npm install
$ npm start
```
