// =====================================
// NOVA STOCK
// =====================================

let products =
    JSON.parse(localStorage.getItem("novaProducts")) || [];

let sales =
    JSON.parse(localStorage.getItem("novaSales")) || [];


// =====================================
// SAVE DATA
// =====================================

function saveProducts() {
    localStorage.setItem(
        "novaProducts",
        JSON.stringify(products)
    );
}

function saveSales() {
    localStorage.setItem(
        "novaSales",
        JSON.stringify(sales)
    );
}


// =====================================
// ADD PRODUCT
// =====================================

function addProduct() {

    const name =
        document.getElementById("productName").value.trim();

    const buy =
        Number(document.getElementById("buyPrice").value);

    const sell =
        Number(document.getElementById("sellPrice").value);

    const stock =
        Number(document.getElementById("stock").value);


    if (name === "") {
        alert("Enter product name.");
        return;
    }

    if (buy <= 0 || sell <= 0) {
        alert("Enter valid prices.");
        return;
    }

    if (stock < 0) {
        alert("Stock cannot be negative.");
        return;
    }


    const product = {

        id: Date.now(),

        name: name,

        buy: buy,

        sell: sell,

        stock: stock

    };


    products.push(product);

    saveProducts();

    document.getElementById("productName").value = "";
    document.getElementById("buyPrice").value = "";
    document.getElementById("sellPrice").value = "";
    document.getElementById("stock").value = "";

    showProducts();
    updateDashboard();

    alert("Product added!");
}


// =====================================
// SHOW PRODUCTS
// =====================================

function showProducts() {

    const list =
        document.getElementById("productList");

    const search =
        document.getElementById("searchBox")
        .value
        .toLowerCase();


    list.innerHTML = "";


    const filteredProducts = products.filter(function(product) {

        return product.name
            .toLowerCase()
            .includes(search);

    });


    if (filteredProducts.length === 0) {

        list.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    filteredProducts.forEach(function(product) {

        let warning = "";

        if (product.stock <= 5) {

            warning =
                `<p class="warning">⚠️ Low stock!</p>`;

        }


        list.innerHTML += `

            <div class="product">

                <h3>${product.name}</h3>

                <p>
                    Buying Price:
                    ₹${product.buy}
                </p>

                <p>
                    Selling Price:
                    ₹${product.sell}
                </p>

                <p>
                    Profit per item:
                    ₹${product.sell - product.buy}
                </p>

                <p>
                    Stock:
                    <strong>${product.stock}</strong>
                </p>

                ${warning}

                <button
                    onclick="sellProduct(${product.id})">
                    Sell
                </button>

                <button
                    onclick="addStock(${product.id})">
                    Add Stock
                </button>

                <button
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </div>

        `;

    });
}


// =====================================
// SELL PRODUCT
// =====================================

function sellProduct(id) {

    const product =
        products.find(function(p) {
            return p.id === id;
        });


    if (!product) {
        return;
    }


    if (product.stock <= 0) {

        alert("Out of stock!");

        return;
    }


    const quantity =
        Number(
            prompt(
                "How many " +
                product.name +
                " do you want to sell?"
            )
        );


    if (
        isNaN(quantity) ||
        quantity <= 0 ||
        !Number.isInteger(quantity)
    ) {

        alert("Enter a valid whole number.");

        return;
    }


    if (quantity > product.stock) {

        alert(
            "Only " +
            product.stock +
            " items are available."
        );

        return;
    }


    product.stock -= quantity;


    const sale = {

        id: Date.now(),

        productName: product.name,

        quantity: quantity,

        sellingPrice:
            product.sell * quantity,

        buyingPrice:
            product.buy * quantity,

        profit:
            (product.sell - product.buy) * quantity,

        date:
            new Date().toISOString()

    };


    sales.push(sale);


    saveProducts();
    saveSales();

    showProducts();
    showSales();
    updateDashboard();


    alert(
        "Sale recorded!\n\n" +
        "Quantity: " + quantity +
        "\nProfit: ₹" + sale.profit
    );
}


// =====================================
// ADD STOCK
// =====================================

function addStock(id) {

    const product =
        products.find(function(p) {
            return p.id === id;
        });


    if (!product) {
        return;
    }


    const amount =
        Number(
            prompt(
                "How many units do you want to add?"
            )
        );


    if (
        isNaN(amount) ||
        amount <= 0 ||
        !Number.isInteger(amount)
    ) {

        alert("Enter a valid whole number.");

        return;
    }


    product.stock += amount;


    saveProducts();

    showProducts();

    updateDashboard();
}


// =====================================
// EDIT PRODUCT
// =====================================

function editProduct(id) {

    const product =
        products.find(function(p) {
            return p.id === id;
        });


    if (!product) {
        return;
    }


    const name =
        prompt(
            "Product name:",
            product.name
        );


    if (name === null || name.trim() === "") {
        return;
    }


    const buy =
        Number(
            prompt(
                "Buying price:",
                product.buy
            )
        );


    const sell =
        Number(
            prompt(
                "Selling price:",
                product.sell
            )
        );


    if (buy <= 0 || sell <= 0) {

        alert("Invalid price.");

        return;
    }


    product.name = name.trim();

    product.buy = buy;

    product.sell = sell;


    saveProducts();

    showProducts();

    updateDashboard();
}


// =====================================
// DELETE PRODUCT
// =====================================

function deleteProduct(id) {

    const product =
        products.find(function(p) {
            return p.id === id;
        });


    if (!product) {
        return;
    }


    const answer =
        confirm(
            "Delete " +
            product.name +
            "?"
        );


    if (!answer) {
        return;
    }


    products =
        products.filter(function(p) {
            return p.id !== id;
        });


    saveProducts();

    showProducts();

    updateDashboard();
}


// =====================================
// SALES HISTORY
// =====================================

function showSales() {

    const list =
        document.getElementById("salesList");


    list.innerHTML = "";


    if (sales.length === 0) {

        list.innerHTML =
            "<p>No sales yet.</p>";

        return;
    }


    const reversedSales =
        [...sales].reverse();


    reversedSales.forEach(function(sale) {

        const date =
            new Date(sale.date);


        list.innerHTML += `

            <div class="product">

                <h3>${sale.productName}</h3>

                <p>
                    Quantity:
                    ${sale.quantity}
                </p>

                <p>
                    Sales:
                    ₹${sale.sellingPrice}
                </p>

                <p>
                    Profit:
                    ₹${sale.profit}
                </p>

                <p>
                    ${date.toLocaleString()}
                </p>

            </div>

        `;

    });
}


// =====================================
// DASHBOARD
// =====================================

function updateDashboard() {

    const now = new Date();


    let totalStock = 0;

    let todaySales = 0;

    let todayProfit = 0;

    let monthProfit = 0;

    let yearProfit = 0;


    products.forEach(function(product) {

        totalStock += product.stock;

    });


    sales.forEach(function(sale) {

        const date =
            new Date(sale.date);


        // TODAY

        if (

            date.getDate() === now.getDate() &&

            date.getMonth() === now.getMonth() &&

            date.getFullYear() === now.getFullYear()

        ) {

            todaySales += sale.sellingPrice;

            todayProfit += sale.profit;

        }


        // MONTH

        if (

            date.getMonth() === now.getMonth() &&

            date.getFullYear() === now.getFullYear()

        ) {

            monthProfit += sale.profit;

        }


        // YEAR

        if (

            date.getFullYear() === now.getFullYear()

        ) {

            yearProfit += sale.profit;

        }

    });


    document.getElementById(
        "totalProducts"
    ).innerText = products.length;


    document.getElementById(
        "totalStock"
    ).innerText = totalStock;


    document.getElementById(
        "todaySales"
    ).innerText =
        "₹" + todaySales;


    document.getElementById(
        "todayProfit"
    ).innerText =
        "₹" + todayProfit;


    document.getElementById(
        "monthProfit"
    ).innerText =
        "₹" + monthProfit;


    document.getElementById(
        "yearProfit"
    ).innerText =
        "₹" + yearProfit;
}


// =====================================
// START APP
// =====================================

showProducts();

showSales();

updateDashboard();