//Setup File System

const fs = require("fs");

//Define a function to parse the data
const datFileToArray = (str, delimiter = "\t") => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str
    .slice(0, str.replace("\r", "").indexOf("\n"))
    .split(delimiter);
  // replace extra white spaces
  // slice from \n index to the end of the text
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

//Define a function to find total volume of a period of time
const totalVolumeForDates = (data, dateParser) => {
  let volumeForDates = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Date.includes(dateParser)) {
      volumeForDates += +data[i].Volume;
    }
  }
  return volumeForDates;
};



const tradingDaysByDate = (data, dateParser) => {
  let counter = 0
  for (let i = 0; i< data.length; i++){
    if(data[i].Date.includes(dateParser))
    {
      counter++
    }
  }
  return counter;
}
//Define a function to find the max difference on one day
const maxDifferenceForOneDay = (data) => {
  let maxDif = 0;
  let maxDifIndex = 0;
  for (let i = 0; i < data.length; i++) {
    let currentDayDifference = data[i].High - data[i].Low;
    if (currentDayDifference > maxDif) {
      maxDif = currentDayDifference;
      maxDifIndex = i;
    }
  }
  return `Max difference for one day: ${maxDif.toFixed(2)} on ${data[maxDifIndex].Date}`;
};
//Define a function to find max profit and days to buy and sell
const maxProfit = (data) => {
  let highestDay = 0;
  let highestDayIndex = 0;

  let lowestDay = 10000;
  let lowestDayIndex = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].High > highestDay) {
      highestDay = data[i].High;
      highestDayIndex = i;
    }
    if (data[i].Low < lowestDay) {
      lowestDay = data[i].Low;
      lowestDayIndex = i;
    }
  }
  //Get and Display our max profit and what buy and sell days to make that profit
  let profit = highestDay - lowestDay;
  let dayToBuy = data[lowestDayIndex].Date;
  let dayToSell = data[highestDayIndex].Date;
  return `Buy on ${dayToBuy} and sell on ${dayToSell} for a max profit of ${profit}`;
};

//Define a variable for our parsed data then grab the data and parse it.
fs.readFile("datafile.dat", "utf8", (err, data) => {
  if (err) throw err;
  let cleanData = datFileToArray(data);

  //Define our volume for July and grab July's rows then add those rows volume to the volume for July.
  let volumeForJuly = totalVolumeForDates(cleanData, "Jul-12");

  //Find the average by dividing the volumeForJuly by the amount of trading days and log it
  let tradingDays = tradingDaysByDate(cleanData,"Jul-12");;
  let averageForJuly = (volumeForJuly / tradingDays).toFixed(2);
  console.log(`Average for July: ${averageForJuly}`);

  //Log our maxDifferenceForOneDay
  console.log(maxDifferenceForOneDay(cleanData));

  //Log our maxProfit function
  console.log(maxProfit(cleanData));

  //Add our data to the dataset with our answers at the top
  rawData =
  `\nVolume for July: ${volumeForJuly}
  \nAverage for July: ${averageForJuly}
  \n${maxDifferenceForOneDay(cleanData)}
  \n${maxProfit(cleanData)} \n\n\n` + data;

  //Write to a new file named outputData.txt

  fs.writeFile("outputData.txt", rawData, (err) => {
    // Throws an error, you could also catch it here
    if (err) throw err;

    // Success case, the file was saved!
    console.log("Saved to outside file!");
  });
});
