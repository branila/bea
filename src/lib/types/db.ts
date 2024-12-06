import PocketBase, { type RecordService } from 'pocketbase'

export type IsoDateString = string

export enum Roles {
  Studente = 'studente',
  Rappresentante = 'rappresentante',
  Organizzatore = 'organizzatore',
  Docente = 'docente',
  Sizurezza = 'sicurezza',
  Admin = 'admin',
  Staff = 'staff',
}

export type UserId = string

export interface User {
  id: UserId,
  email: string,
  emailVisibiliy?: boolean,
  verified: boolean,
  surname: string
  name: string
  class: string,
  studentId: string,
  role: Roles[],
  banned: boolean,
  created: IsoDateString,
  updated: IsoDateString,
}

export type ActivityId = string

export interface Activity {
  id: ActivityId,
  name: string,
  turns: 1 | 3,
  organizers: UserId[],
  capacity: number[],
  created: IsoDateString,
  updated: IsoDateString,
  expand?: {
    organizers: User[]
  }
}

export type TicketId = string

export interface Ticket {
  id: TicketId,
  user: UserId,
  scanned?: IsoDateString,
  authenticator?: UserId,
  registration: RegistrationId,
  created: IsoDateString,
  updated: IsoDateString,
  expand?: {
    user?: User,
    registration?: Registration
  }
}

export type RegistrationId = string

export interface Registration {
  id: RegistrationId,
  user: UserId,
  activity0: ActivityId,
  activity1: ActivityId,
  activity2: ActivityId,
  created: IsoDateString,
  updated: IsoDateString,
  expand?: {
    user?: User,
    activity0?: Activity,
    activity1?: Activity,
    activity2?: Activity,
  }
}

export interface BeaPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'users'): RecordService<User>
  collection(idOrName: 'activities'): RecordService<Activity>
  collection(idOrName: 'tickets'): RecordService<Ticket>
  collection(idOrName: 'registrations'): RecordService<Registration>
}
