import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

export default interface Note {
  createdBy: string
  createdDateTime: string
  attribute: AlreadyInPlaceValue
  text: string
}
