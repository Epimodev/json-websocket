import LineByLine from 'n-readlines'
import { Source } from '@epimodev/callbag-doki'
import { createSource } from '@epimodev/callbag-doki/sources'
import { ServerOptions } from '../types'

/**
 * get interval between 2 messages in ms
 * @param lastMessage - last message sent to client
 * @param nextMessage - next message to send to client
 * @param timerField - field where timestamp can be stored
 * @param defaultInterval - interval to use if there isn't timerField
 * @return interval in ms
 */
function getMessageInterval(
  lastMessage: any,
  nextMessage: any,
  timerField: string | undefined,
  defaultInterval: number,
): number {
  if (!timerField) {
    return defaultInterval
  }
  const lastTimestamp = lastMessage[timerField]
  const nextTimestamp = nextMessage[timerField]
  if (typeof lastTimestamp !== 'number' || typeof nextTimestamp !== 'number') {
    return defaultInterval
  }

  const interval = nextTimestamp - lastTimestamp

  return Math.max(interval, 0) // avoid negative value
}

/**
 * Create a stream based on jsonlines file
 */
function jsonStream({ filePath, delay, timer_field, interval }: ServerOptions): Source<string> {
  return createSource((next, complete, error) => {
    try {
      let t: NodeJS.Timeout
      const liner = new LineByLine(filePath)

      // send line and read next line to know when it should be send
      const sendMessage = (message: any, timeout: number): void => {
        t = setTimeout(() => {
          next(JSON.stringify(message))

          const nextLine = liner.next()
          if (nextLine) {
            try {
              const nextMessage = JSON.parse(nextLine.toString())
              const nextTimeout = getMessageInterval(message, nextMessage, timer_field, interval)

              sendMessage(nextMessage, nextTimeout * 1000)
            } catch (e) {
              liner.close()
              error(e)
            }
          } else {
            complete()
          }
        }, timeout)
      }

      // Read first line
      const firstLine = liner.next()
      if (firstLine) {
        try {
          const firstMessage = JSON.parse(firstLine.toString())
          // send message, next message is read in sendMessage function
          sendMessage(firstMessage, delay * 1000)
        } catch (e) {
          liner.close()
          error(e)
        }
      } else {
        complete()
      }

      return () => {
        clearTimeout(t)
        liner.close()
      }
    } catch (e) {
      error(e)
    }
  })
}

export { jsonStream }
