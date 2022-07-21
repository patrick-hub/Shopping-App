// Create a new indexedDB Data base with dexie
const db = new Dexie('ShoppingApp')

// define the structure of our data base
db.version(1).stores( { items: '++id,name,price,isPurchased'}) // ++ means auto generate the id for each item

const itemForm = document.getElementById('item-form');
const itemsDiv = document.getElementById('itemsDiv')
const totalPriceDiv = document.getElementById('totalPriceDiv');

// create a function to fetch the items from the data base and populate the itemsdiv with those items
const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray() // gets all the items in the database

    itemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}" >
    <label>
    <input type="checkbox" class="checkbox"  onchange="toggleItemStatus(event, ${item.id})" ${item.isPurchased && 'checked'}>
</label>
    <div class="itemInfo">
        <p>${item.name}</p>
        <p>$${item.price} x ${item.quantity}</p>
    </div>
    <button id="deleteButton" onclick="removeItem(${item.id})">X</button>
</div>
    `).join('')
    // calculate the total price
    const arrayOfPrices = allItems.map(item => item.price * item.quantity);
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)

    totalPriceDiv.innerText = 'Total Price: $' + totalPrice
}

// call the populate div function when the window loads up
window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => { //async function because we are using dexie
    event.preventDefault()

    // To get the value of the items
    const name = document.getElementById('nameInput').value
    const quantity = document.getElementById('quantityInput').value
    const price = document.getElementById('priceInput').value

    // To add the item to our data base, we use the await keyword
    
    await db.items.add({name, quantity, price})
    await populateItemsDiv()

    // to clear the form each time we add an item to the data base
    itemForm.reset()
}

// To mark an item and update in the data base
const toggleItemStatus = async (event, id) => {
    await db.items.update(id, {isPurchased: !!event.target.checked})  // To update data in the data base
    await populateItemsDiv() // to populate the items div with new data
}

// To delete data from the data base
const removeItem = async(id)=> {
    await db.items.delete(id)
    await populateItemsDiv()
}