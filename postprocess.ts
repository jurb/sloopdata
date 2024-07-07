// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename

console.log(`Processing ${filename}...`)

const result = await unZipFromFile(filename, filename + '.csv')
const output = result ? 'File unzipped successfully' : 'Error unzipping'
console.log(output)