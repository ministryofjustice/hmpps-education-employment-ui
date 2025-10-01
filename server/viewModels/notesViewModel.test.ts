import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import NotesViewModel from './notesViewModel'

describe('NotesViewModel', () => {
  const date = new Date('2022-04-30T13:00:00Z')
  const notesJson = {
    createdBy: 'Jane Doe',
    createdName: 'Jane',
    createdDateTime: date.toISOString(),
    attribute: 'test',
    text: 'This is a note.',
  }

  it('transforms JSON to NotesViewModel instance', () => {
    const notesViewModel = plainToClass(NotesViewModel, notesJson)

    expect(notesViewModel.createdBy).toBe(notesJson.createdBy)
    expect(notesViewModel.createdName).toBe(notesJson.createdName)
    expect(notesViewModel.createdDateTime[0]).toEqual('30 Apr 2022')
    expect(notesViewModel.createdDateTime[1]).toEqual(`${date.getHours()}:${date.getMinutes() || '00'}`)
    expect(notesViewModel.attribute).toBe(notesJson.attribute)
    expect(notesViewModel.text).toBe(notesJson.text)
  })
})
