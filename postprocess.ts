// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename

console.log(`Processing ${filename}...`)


import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";

console.log(await decompress("bag.zip"))