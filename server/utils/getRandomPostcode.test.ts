import getRandomPostcode from './getRandomPostcode'

describe('getRandomPostcode', () => {
  it('should return a string', () => {
    const result = getRandomPostcode()
    expect(typeof result).toBe('string')
  })

  it('should return a valid postcode from the list', () => {
    const postcodes = [
      'LS1 4DY',
      'LS2 3AB',
      'LS3 1HG',
      'LS4 2RZ',
      'LS5 3BH',
      'LS6 2HG',
      'LS7 3NB',
      'LS8 1AP',
      'LS9 8AH',
      'LS10 2AR',
      'LS11 6DB',
      'LS12 3DN',
      'LS13 4DJ',
      'LS14 6JD',
      'LS15 7NR',
      'LS16 6RF',
      'LS17 6WE',
      'LS18 4HD',
      'LS19 7DP',
      'LS20 8BE',
      'LS21 1AE',
      'LS22 6RY',
      'LS23 6LT',
      'HG1 2RD',
      'HG2 8NZ',
      'YO1 9QL',
      'YO10 4GU',
      'YO24 3BG',
      'YO26 5LF',
      'S1 2JB',
      'S2 5PQ',
      'S3 7HF',
      'S10 5DB',
      'S11 8QB',
      'S12 4TA',
      'S61 2QT',
      'DN1 1NF',
      'DN3 2DJ',
      'M1 3FY',
      'M2 5GP',
      'M3 5EN',
      'M4 5BD',
      'M5 4PF',
      'M6 7FD',
      'OL1 1AA',
      'OL2 5QD',
      'BB1 6AA',
      'BB2 1ES',
      'PR1 2HE',
      'PR2 2DP',
    ]
    const result = getRandomPostcode()
    expect(postcodes).toContain(result)
  })

  it('should be able to produce each postcode at least once over multiple runs', () => {
    const postcodes = [
      'LS1 4DY',
      'LS2 3AB',
      'LS3 1HG',
      'LS4 2RZ',
      'LS5 3BH',
      'LS6 2HG',
      'LS7 3NB',
      'LS8 1AP',
      'LS9 8AH',
      'LS10 2AR',
      'LS11 6DB',
      'LS12 3DN',
      'LS13 4DJ',
      'LS14 6JD',
      'LS15 7NR',
      'LS16 6RF',
      'LS17 6WE',
      'LS18 4HD',
      'LS19 7DP',
      'LS20 8BE',
      'LS21 1AE',
      'LS22 6RY',
      'LS23 6LT',
      'HG1 2RD',
      'HG2 8NZ',
      'YO1 9QL',
      'YO10 4GU',
      'YO24 3BG',
      'YO26 5LF',
      'S1 2JB',
      'S2 5PQ',
      'S3 7HF',
      'S10 5DB',
      'S11 8QB',
      'S12 4TA',
      'S61 2QT',
      'DN1 1NF',
      'DN3 2DJ',
      'M1 3FY',
      'M2 5GP',
      'M3 5EN',
      'M4 5BD',
      'M5 4PF',
      'M6 7FD',
      'OL1 1AA',
      'OL2 5QD',
      'BB1 6AA',
      'BB2 1ES',
      'PR1 2HE',
      'PR2 2DP',
    ]

    const results = new Set<string>()
    for (let i = 0; i < 1000; i += 1) {
      // Run the function multiple times to increase the chance of hitting each postcode
      results.add(getRandomPostcode())
    }

    // Ensure every postcode appears at least once
    postcodes.forEach(postcode => {
      expect(results).toContain(postcode)
    })
  })
})
