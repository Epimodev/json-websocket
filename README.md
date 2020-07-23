# json-websocket: create websocket with just a jsonlines file

### Presentation

`json-websocket` is a cli which makes possible to create a WebSocket with a jsonlines file (more info about jsonlines here: [http://jsonlines.org/](http://jsonlines.org/)).  
It's like [json-server](https://github.com/typicode/json-server), but it creates a WebSocket instead of a REST api.

### Motivation

Initially I made this project to help people have the same experience as PandaScore live api without waiting for a live match.  
But it will help us also create WebSocket with fake data for our development environment.  
We can also imagine with this tool a way to reproduce some bugs related to realtime.

### Instalation

```sh
# install locally in your project
yarn add @epimodev/json-websocket
# install globally
yarn global add @epimodev/json-websocket

# or with npm
npm install @epimodev/json-websocket
# install globally
npm install --global @epimodev/json-websocket
```

### Usage

```sh
# start a WebSocket server which sends events stored in `live_frames.jsonl` (jsonl is the extension for jsonlines files)
json-websocket live_frames.jsonl

# start a WebSocket server binded to 8080 port
json-websocket live_frames.jsonl --port 8080

# start a WebSocket server with timestamp stored in `current_timestamp` field of each line
# this is usefull to reproduct exactly the same intervals as the recorded WebSocket
json-websocket live_frames.jsonl --timer_field current_timestamp

# start a WebSocket server with an interval of 2 seconds between each event sent
json-websocket live_frames.jsonl --interval 2
```

### Options
```sh
Description
  Run a websocket server with a jsonlines file

Usage
  $ json-websocket [file_path] [options]

Options
  --host               Hostname to bind  (default localhost)
  -p, --port           Port to bind  (default 4000)
  -d, --delay          delay before sending first message (in seconds)  (default 0)
  -f, --timer_field    field to get interval between two messages (in seconds)
  --fast_forward       decrease interval between messages, works only with timer_field (value is a factor)  (default 1)
  -i, --interval       interval between 2 messages in seconds if there isn't any field giving the information  (default 1)
  -v, --version        Displays current version
  -h, --help           Displays this message

Examples
  $ json-websocket my_events.jsonl
  $ json-websocket my_events.jsonl --port 8080
```

### Ways of improvements
- display number of connected clients
- improve logs about messages send
- add a progress bar
- add unit tests
