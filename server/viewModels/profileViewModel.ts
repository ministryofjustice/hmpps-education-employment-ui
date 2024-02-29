/* eslint-disable @typescript-eslint/no-explicit-any */

// Required import for jest
import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'

import { formatDateStringTodMMMM } from '../utils/index'
import ProfileDataSectionViewModel from './profileDataSectionViewModel'

// Exclude all by default expose properties when needed
@Exclude()
export default class ProfileViewModel {
  @Expose()
  offenderId: string

  @Expose()
  bookingId: number

  createdBy: string

  createdDateTime: string

  @Expose()
  modifiedBy: string

  @Expose()
  modifiedByName: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  schemaVersion: string

  @Expose()
  @Type(() => ProfileDataSectionViewModel)
  profileData: ProfileDataSectionViewModel
}
