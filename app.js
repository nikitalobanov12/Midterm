const fs = require("node:fs/promises");
const { EOL } = require("node:os");

const verifyType = (type) => {
    if(type == "mr") return "medium-roast";
    if(type == "dr") return "dark-roast";
    if(type == "b") return "blonde";
    else throw new Error(`${type} is not a valid coffee type.`);
}
const splitLines = (string) => string.split(EOL);


const getInventory = (coffeeType)=> {
    const name = verifyType(coffeeType);
    return fs.readFile("stock.txt", "utf-8")
    .then((result) => splitLines(result))
    .then ((result)=>{
        let count = 0;
        for (const line of result) if(line == name) count++;
        return count
    })
}

const addInventory = (coffeeType) => {
    const name = verifyType(coffeeType);
    return fs.readFile("stock.txt", "utf-8")
    .then((result) => result += `${EOL}${name}`)
    .then((result) => fs.writeFile("stock.txt", result))
}

const removeInventory = (coffeeType,  quantity) => {
    const name = verifyType(coffeeType);
    return fs.readFile('stock.txt', 'utf-8')
    .then((result) => splitLines(result))
    .then((result) => {
        let deleteCounter = 0;
        for (let i = 0; i < result.length; i++) {
            if(deleteCounter > quantity) break;
            if(name == result[i]) {
                result.splice(i, 1);
                i--;
                deleteCounter++;
            }
        }
        if(quantity == "*") deleteCounter = "all";
        const coffeeOrCoffees = (deleteCounter == 1 ? 'coffee' : 'coffees');
        console.log(`${deleteCounter} ${name} ${coffeeOrCoffees} deleted`);
        return result;
    })
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
