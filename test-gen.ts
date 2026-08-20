import { generateAvailableTasks } from './scripts/generate-available-tasks.ts'

const run = async () => {
  const code = await generateAvailableTasks()
  if (code.includes('4_1_11')) {
    console.log('Found 4_1_11!')
  } else {
    console.log('4_1_11 NOT found in generated code.')
    // Print first 500 characters of the generated availableTasks object to see what's there for 4_1
    const match = code.match(/const availableTasks = ([\s\S]*?);/)
    if (match) {
      console.log('Sample of availableTasks:', match[1].substring(0, 500))
    }
  }
}

run()
