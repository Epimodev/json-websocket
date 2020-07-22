#!/usr/bin/env node
import sade from 'sade'
import subscribe from '@epimodev/callbag-doki/utils/subscribe'
import { jsonStream } from './utils/jsonStream'
import { startWsServer } from './utils/websocket'
import { ServerOptions } from './types'

sade('json-websocket [file_path]', true)
  .version('0.1.1')
  .describe('Run a websocket server with a jsonlines file')
  .example('my_events.jsonl')
  .example('my_events.jsonl --port 8080')
  .option('--host', 'Hostname to bind', 'localhost') // no -h because it's use for help
  .option('-p, --port', 'Port to bind', 4000)
  .option('-d, --delay', 'delay before sending first message (in seconds)', 0)
  .option('-f, --timer_field', 'field to get interval between two messages (in seconds)')
  .option(
    '--fast_forward',
    'decrease interval between messages, works only when timer_field is defined (value is a factor)',
    1,
  )
  .option(
    '-i, --interval',
    "interval between 2 messages in seconds if there isn't any field giving the information",
    1,
  )
  .action(startServer)
  .parse(process.argv)

async function startServer(
  filePath: string,
  options: { [key: string]: string | number | undefined },
) {
  const params: ServerOptions = {
    filePath,
    host: options.host as string,
    port: options.port as number,
    delay: options.delay as number,
    timer_field: options.timer_field as string,
    fast_forward: options.fast_forward as number,
    interval: options.interval as number,
  }

  const sendWsMessage = startWsServer(params)

  let nbMessages = 0
  subscribe(jsonStream(params))({
    next: message => {
      sendWsMessage(message)
      nbMessages += 1
      process.stdout.write(`Message number ${nbMessages} sent\n`)
    },
    error: err => {
      process.stderr.write(err)
    },
    complete: () => {
      process.stdout.write(`File completed\n`)
    },
  })

  process.stdout.write(`Server started on port ${params.port}\n`)
}
