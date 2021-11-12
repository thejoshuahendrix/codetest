//Setup File System

const fs = require("fs");

//Define a function to parse the data

const datFileToArray = (str, delimiter = "\t") => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str
    .slice(0, str.replace("\r", "").indexOf("\n"))
    .split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str
    .replace(/(\n|\n)/gm, "")
    .slice(str.indexOf("\n"))
    .split("\r");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array

  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
};

//Define a variable for our parsed data then grab the data and parse it.
fs.readFile("datafile.dat", "utf8", (err, data) => {
  if (err) throw err;
  let cleanData = datFileToArray(data);

  //Define our volume for July and grab July's rows then add those rows volume to the volume for July.
  let volumeForJuly = 0;
  for (let i = 0; i < cleanData.length; i++) {
    if (cleanData[i].Date.includes("Jul-12")) {
      volumeForJuly += +cleanData[i].Volume;
    }
  }
  console.log(`Volume for July: ${volumeForJuly}`);

  //Find the average by dividing the volumeForJuly by 31
  let average = volumeForJuly / 31;
  console.log(`Average for July: ${average}`);

  //Define our maxDifference and find it by taking the high minus the low
  let maxDif = 0;
  let maxDifIndex = 0;
  for (let i = 0; i < cleanData.length; i++) {
    let currentDayDifference = cleanData[i].High - cleanData[i].Low;
    if (currentDayDifference > maxDif) {
      maxDif = currentDayDifference;
      maxDifIndex = i;
    }
  }
  console.log(
    `Max difference for one day: ${maxDif} on ${cleanData[maxDifIndex].Date}`
  );

  //Define our highest and lowest day and indicies
  let highestDay = 0;
  let highestDayIndex = 0;

  let lowestDay = 10000;
  let lowestDayIndex = 0;

  for (let i = 0; i < cleanData.length; i++) {
    if (cleanData[i].High > highestDay) {
      highestDay = cleanData[i].High;
      highestDayIndex = i;
    }
    if (cleanData[i].Low < lowestDay) {
      lowestDay = cleanData[i].Low;
      lowestDayIndex = i;
    }
  }

  //Get and Display our max profit and what buy and sell days to make that profit
  let maxProfit = highestDay - lowestDay;
  let dayToBuy = cleanData[lowestDayIndex].Date;
  let dayToSell = cleanData[highestDayIndex].Date;
  console.log(
    `Buy on ${dayToBuy} and sell on ${dayToSell} for a max profit of ${maxProfit}`
  );

  //Add our data to the dataset with our answers at the top

  rawData =
    `
  \nVolume for July: ${volumeForJuly}
  \nAverage for July: ${average}
  \nMax difference for one day: ${maxDif} on ${cleanData[maxDifIndex].Date}
  \nBuy on ${dayToBuy} for a max profit of ${maxProfit} \n\n\n` + data;

  //Write to a new file named outputData.txt

  fs.writeFile("outputData.txt", rawData, (err) => {
    // Throws an error, you could also catch it here
    if (err) throw err;

    // Success case, the file was saved!
    console.log("Saved to outside file!");
  });
});
