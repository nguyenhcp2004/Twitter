import { ParamsDictionary } from 'express-serve-static-core'

export interface ConversationParam extends ParamsDictionary {
  receiver_id: string
}
