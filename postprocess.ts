import { readCSV } from "jsr:@vslinko/csv";

const f = await Deno.open("./bag_panden.csv");
for await (const row of readCSV(f)) {
    console.log("row:");
    for await (const cell of row) {
        console.log(`  cell: ${cell}`);
    }
}

f.close();
