import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import NotesViewModel from './notesViewModel'

describe('NotesViewModel', () => {
  const notesJson = {
    createdBy: 'Jane Doe',
    createdName: 'Jane',
    createdDateTime: '2022-04-30T13:00:00Z',
    attribute: 'test',
    text: 'This is a note.',
  }

  it('transforms JSON to NotesViewModel instance', () => {
    const notesViewModel = plainToClass(NotesViewModel, notesJson)

    expect(notesViewModel.createdBy).toBe(notesJson.createdBy)
    expect(notesViewModel.createdName).toBe(notesJson.createdName)
    expect(notesViewModel.createdDateTime).toEqual(['30 Apr 2022', '14:00'])
    expect(notesViewModel.attribute).toBe(notesJson.attribute)
    expect(notesViewModel.text).toBe(notesJson.text)
  })
})
