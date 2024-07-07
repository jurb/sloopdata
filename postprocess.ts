import { unZipFromFile } from "https://deno.land/x/flat@0.0.15/src/zip.ts";
import { parse } from "jsr:@std/csv";
import { writeJSON } from 'https://deno.land/x/flat/mod.ts'

// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename
// const filename = 'bag.zip' // Same name as downloaded_filename

console.log(`Processing ${filename}...`)

const result = await unZipFromFile(filename)

const rawContent = Deno.readFileSync('./bag_panden.csv')
const decodedContent = new TextDecoder().decode(rawContent)
// Parse it
const parsed = await parse(decodedContent, {
    skipFirstRow: true,
    strip: true,
})

import administrativeAreasPropertiesFlat from "./administrativeAreas.json" with { type: "json" }



// const stadsdelen = await fetch('https://api.data.amsterdam.nl/v1/gebieden/stadsdelen?page_size=999999').then(res => res.json())
// console.log('stadsdelen: ' + stadsdelen._embedded.stadsdelen.length)

// const wijken = await fetch('https://api.data.amsterdam.nl/v1/gebieden/wijken?page_size=999999').then(res => res.json())
// console.log('wijken: ' + wijken._embedded.wijken.length)

// const buurten = await fetch('https://api.data.amsterdam.nl/v1/gebieden/buurten?page_size=999999').then(res => res.json())
// console.log('buurten: ' + buurten._embedded.buurten.length)

const getBuurten_weesp = () => {
    const weesp = administrativeAreasPropertiesFlat.stadsdelen.find((d) => d.properties.naam === "Weesp");
    const wijken_weesp = administrativeAreasPropertiesFlat.wijken.filter(
        (d) => d.properties.ligtInStadsdeelId === weesp.properties.identificatie
    );
    return administrativeAreasPropertiesFlat.buurten.filter((d) =>
        wijken_weesp.map((e) => e.properties.identificatie).includes(d.properties.ligtInWijkId)
    );
}

const buurten_weesp = getBuurten_weesp()

const bag_panden = parsed
    .filter(
        (d) =>
            !buurten_weesp.map((e) => e.properties.identificatie).includes(d.Ligtinbuurtid)
    )
    .map((d) => ({
        geo: administrativeAreasPropertiesFlat.buurten.find(
            (e) => e.properties.identificatie === d.Ligtinbuurtid
        ),
        ...d
    }))

const bag_panden_gesloopt = bag_panden
    .filter((d) => d.Statusomschrijving === "Pand gesloopt")
    .map((d) => d)
    .map(({ Geometrie, index, ...rest }) => ({
        ...rest
    }))
    .map((d) => ({
        stadsdeel: d?.geo?.properties.ligtInStadsdeel?.naam,
        wijk: d?.geo?.properties.ligtInWijk?.naam,
        buurt: d?.geo?.properties.naam,
        ...d
    }))
    .map(({ geo, index, ...rest }) => ({
        ...rest
    }))

// console.log(bag_panden_gesloopt)

await writeJSON('bag_panden_gesloopt.json', bag_panden_gesloopt) // create a new JSON file with just the Bitcoin price
console.log("Wrote a post process file")

