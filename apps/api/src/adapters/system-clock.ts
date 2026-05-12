import { Clock } from "@remindler/application"

export class SystemClock implements Clock {
  now(): Date {
    return new Date()
  }
}
