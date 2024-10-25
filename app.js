const fs = require("node:fs/promises");
const { EOL } = require("node:os");

//helper function to convert coffeeType to the full name & verify if the coffeeType is valid
const verifyType = (type) => {
    if(type == "mr") return "medium-roast";
    if(type == "dr") return "dark-roast";
    if(type == "b") return "blonde";
    else throw new Error(`${type} is not a valid coffee type.`);
}

//helper function convert string to array 
const splitLines = (string) => string.split(EOL);

//helper function for removeInventory
//loops through the array and deletes <quantity> amount of lines that match with <name>
const deleteLines = (coffeeArray, name, quantity) => {
    let deleteCounter = 0;
    for (let i = 0; i < coffeeArray.length; i++) {
        if(deleteCounter > quantity) break;
        if(name == coffeeArray[i]) {
            coffeeArray.splice(i, 1);
            i--;
            deleteCounter++;
        }
    }
    // if the quantity input was '*' make it output the word "all" instead of the number of items deleted.
    if(quantity == "*") deleteCounter = "all";
    //if 1 item was deleted, set it to output "coffee", else output "coffees"
    const coffeeOrCoffees = (deleteCounter == 1 ? 'coffee' : 'coffees');
    console.log(`${deleteCounter} ${name} ${coffeeOrCoffees} deleted`);
    //return the array to write back to the file
    return coffeeArray;
}

const getInventory = (coffeeType)=> {
    const name = verifyType(coffeeType);
    return fs.readFile("stock.txt", "utf-8")
    .then((result) => splitLines(result))
    .then ((result)=>{
        let count = 0;
        //loops through each line of the array, if the line matches the name that is inputted, increment the counter for how many of that type is in the stock.txt file
        for (const line of result) if (line == name) count++;
        return count
    })
}

const addInventory = (coffeeType) => {
    const name = verifyType(coffeeType);
    return fs.readFile("stock.txt", "utf-8")
    // add the coffee type to the end of the string
    .then((result) => result += `${EOL}${name}`)
    //write the modified string back to the stock.txt file
    .then((result) => fs.writeFile("stock.txt", result))
}

const removeInventory = (coffeeType,  quantity) => {
    const name = verifyType(coffeeType);
    return fs.readFile('stock.txt', 'utf-8')
    .then((result) => splitLines(result))
    .then((result) => deleteLines(result, name, quantity))
    .then((result) => fs.writeFile('stock.txt', result.join(EOL)))
    .catch((err)=> console.error(`error: ${err}`))
}

getInventory("mr")
.then((result) => console.log(result))
.then( () => addInventory("mr"))
.then(() => getInventory("mr"))
.then((result) => console.log(result))
.then(()=> removeInventory("mr", 4))
.then(()=> getInventory('mr'))
.then((result) => console.log(result))
.catch((error)=>console.error(error))
