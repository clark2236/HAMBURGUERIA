const menu = document.getElementById("menu")
const cartbtn = document.getElementById("cart-btn")
const cartmodal = document.getElementById("cart-modal")
const cartItemscontainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closemodalbtn = document.getElementById("close-modal-btn")
const cartcouter = document.getElementById("cart-count")
const addressinput = document.getElementById("address")
const addresswarn = document.getElementById("addres-warn")

let cart = [];


cartbtn.addEventListener("click", function () {
    cartmodal.style.display = "flex"
    updatecartmodal();
})

// fechar modal clicar
cartmodal.addEventListener("click", function (event) {
    if (event.target === cartmodal) {
        cartmodal.style.display = "none"
    }
})

closemodalbtn.addEventListener("click", function () {
    cartmodal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    // console.log targget

    let parentbutton = event.target.closest(".add-to-cart-btn")
    if (parentbutton) {
        const name = parentbutton.getAttribute("data-name")
        const trace = parseFloat(parentbutton.getAttribute("data-trace"))
        addtocart(name, trace)

    }
})


// funcao para adiconar no carrinho
function addtocart(name, trace) {
    const existingitem = cart.find(item => item.name === name)

    if (existingitem) {
        // se o item , aumenta apenas + 1 
        existingitem.quantity += 1;
    } else {
        cart.push({
            name,
            trace,
            quantity: 1,
        })

    }
    updatecartmodal()
}


//atualisar o carrinho
function updatecartmodal() {
    cartItemscontainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justity-between", "mb-4", "flex-col")


        cartItemElement.innerHTML = `

            <div class="flex items-center justify-between">
                <div>
                 <p class=" font-medium">${item.name}</p>
                 <p>Qtd: ${item.quantity}</p>
                 <p class="font-medium", "mb-2">${item.trace.toFixed(2)}</p>
                </div>
                
                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                  remover
                </button>
                       
            </div>


        
        
        `
        total += item.trace * item.quantity;
        cartItemscontainer.appendChild(cartItemElement)
    })


    cartTotal.textContent = total.toLocaleString("PT-BR", {
        style: "currency",
        currency: "BRL"

    })

    cartcouter.innerHTML = cart.length;
}


//função remover carrinho

cartItemscontainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeitemCart(name);


    }
})


function removeitemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updatecartmodal();
            return;
        }

        cart.splice(index, 1);
        updatecartmodal();

    }
}

addressinput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressinput.classList.remove("border-red-500")
        addresswarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkrestaurantOpen();
    if(!isOpen){
        alert("O RESTAURANTE ESTA FECHADO NO MOMENTO")
        return;
    }

    
    if (cart.length === 0) return;
    if (addressinput.value === "") {
        addresswarn.classList.remove("hidden")
        addressinput.classList.add("border-red-500")
        return;
    }
    //enviar pedido no zap
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preco: R$${item.trace} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "24993951916"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressinput.value}`, "_blank")

    cart =[];
    updatecartmodal();
    
    

    
})


// verificar horarios

function checkrestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true aberto
}

const spanItem = document.getElementById("date-spam")
const isOpen = checkrestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}