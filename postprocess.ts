import { unZipFromFile } from "https://deno.land/x/zip@v1.1.0/unzip.ts";
import { readCSV } from "jsr:@vslinko/csv";
import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts'

// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename

const bag_panden_file = await unZipFromFile(filename, 'bag_panden.csv')

for await (const row of readCSV(bag_panden_file)) {
    console.log("row:");
    for await (const cell of row) {
        console.log(`  cell: ${cell}`);
    }
}

