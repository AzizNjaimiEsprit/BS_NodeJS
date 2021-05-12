function addToCard(bookId) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/basket/add",
        data: JSON.stringify({
            "userId": 4/*userId*/,
            "bookId": bookId,
            "quantity": document.getElementById("qty").value? document.getElementById("qty").value :1,
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function (errMsg) {
            console.log("Return of add product to basket = ", errMsg.responseText)
            if (errMsg.responseText == "ok")
                alert("Book added to basket successfully")
        }
    });
}
function addToWishList(bookId) {
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/wishList/add",
        data: JSON.stringify({
            "userId": 4/*userId*/,
            "bookId": bookId,
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function (errMsg) {
            console.log("Return of add product to wishlist = ", errMsg.responseText)
            if (errMsg.responseText == "ok")
                alert("Book added to wishlist successfully")
        }
    });
}