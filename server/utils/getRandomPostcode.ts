export default function getRandomPostcode(): string {
  const postcodes = [
    'LS1 4DY', // Leeds City Centre
    'LS2 3AB', // Leeds University Area
    'LS3 1HG', // Burley, Woodhouse
    'LS4 2RZ', // Kirkstall, Burley
    'LS5 3BH', // Kirkstall, Hawksworth
    'LS6 2HG', // Headingley, Hyde Park
    'LS7 3NB', // Chapel Allerton, Meanwood
    'LS8 1AP', // Roundhay, Oakwood
    'LS9 8AH', // Harehills, Richmond Hill
    'LS10 2AR', // Middleton, Belle Isle
    'LS11 6DB', // Beeston, Holbeck
    'LS12 3DN', // Armley, Wortley
    'LS13 4DJ', // Bramley, Rodley
    'LS14 6JD', // Seacroft, Whinmoor
    'LS15 7NR', // Cross Gates, Colton
    'LS16 6RF', // Cookridge, Adel
    'LS17 6WE', // Moortown, Alwoodley
    'LS18 4HD', // Horsforth
    'LS19 7DP', // Yeadon
    'LS20 8BE', // Guiseley
    'LS21 1AE', // Otley
    'LS22 6RY', // Wetherby
    'LS23 6LT', // Boston Spa, Bramham
    'HG1 2RD', // Harrogate
    'HG2 8NZ', // Harrogate South
    'YO1 9QL', // York City Centre
    'YO10 4GU', // Fulford, York
    'YO24 3BG', // Acomb, Holgate
    'YO26 5LF', // Upper Poppleton, York
    'S1 2JB', // Sheffield City Centre
    'S2 5PQ', // Arbourthorne, Highfield
    'S3 7HF', // Burngreave, Netherthorpe
    'S10 5DB', // Crookes, Broomhill
    'S11 8QB', // Ecclesall, Greystones
    'S12 4TA', // Gleadless, Intake
    'S61 2QT', // Rotherham North
    'DN1 1NF', // Doncaster Centre
    'DN3 2DJ', // Armthorpe, Doncaster
    'M1 3FY', // Manchester City Centre
    'M2 5GP', // Manchester (Deansgate)
    'M3 5EN', // Salford, Manchester
    'M4 5BD', // Ancoats, Northern Quarter
    'M5 4PF', // Salford Central
    'M6 7FD', // Salford, Pendleton
    'OL1 1AA', // Oldham
    'OL2 5QD', // Royton, Oldham
    'BB1 6EA', // Blackburn
    'BB2 1ES', // Blackburn South, Darwen
    'PR1 2HE', // Preston City Centre
    'PR2 2DP', // Fulwood, Preston
  ]

  const randomIndex = Math.floor(Math.random() * postcodes.length)
  return postcodes[randomIndex]
}
