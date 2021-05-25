//import { toastr } from '/public/js/toastr'
var toastr = require('toastr');
// Basket WS
function insertIntoCard(bookId,type) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/basket/add",
        data: JSON.stringify({
            "userId": JSON.parse(sessionStorage.currentUser).userId,
            "bookId": bookId,
            "quantity": document.getElementById("qty") ? document.getElementById("qty").value :1,
            "type": type ? type : 'PHYSICAL',
        }),
        contentType: "application/json",
            success: function (response) {
            console.log("Return of add product to basket = ", response)
            if (response == "ok")
                toastr.info("Book added to basket successfully")
        }
    });
}
function updateCard(bookId,type) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/basket/update",
        data: JSON.stringify({
            "userId": JSON.parse(sessionStorage.currentUser).userId,
            "bookId": bookId,
            "quantity": document.getElementById("qty") ? document.getElementById("qty").value :1,
            "type": type ? type : 'PHYSICAL',
        }),
        contentType: "application/json",
            success: function (response) {
                console.log("Return of add product to basket = ", response)
            if (response == "Updated" && document.getElementById("noAlert") == null)
                alert("Book Updated to basket successfully")
        }
    });
}

function checkIfBookIsInBasket(bookId,type,add,update){
    $.get("http://localhost:5000/basket/getCount/" + bookId, function (data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        if (Number(data) > 0){
            update(bookId,type)
        }else{
            add(bookId,type)
        }

    });
}

function addToCard(bookId,type) {
    if (!checkUserLoggedIn()){
        alert("User Not logged in !!!!")
        return
    }
    checkIfBookIsInBasket(bookId,type,insertIntoCard,updateCard);
}

// WishList WS

function checkIfBookIsInWishList(bookId,add){
    $.get("http://localhost:5000/wishList/getCount/" + bookId, function (data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        if (Number(data) > 0){
            alert("Book already exist in your wishlist ")
        }else{
            add(bookId)
        }

    });
}

function addToWishList(bookId) {
    if (!checkUserLoggedIn()){
        alert("User Not logged in !!!!")
        return
    }
    checkIfBookIsInWishList(bookId,insertIntoWishList);
}
function insertIntoWishList(bookId){
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/wishList/add",
        data: JSON.stringify({
            "userId": JSON.parse(sessionStorage.currentUser).userId,
            "bookId": bookId,
        }),
        contentType: "application/json",
            success: function (response) {
            console.log("Return of add product to wishlist = ", response)
            if (response == "ok")
                alert("Book added to wishlist successfully")
        }
    });
}

function checkUserLoggedIn(){
    return sessionStorage.currentUser
}



