const acceptButton = document.querySelector(".save-change-btn");

acceptButton.addEventListener("click", (event) => {
    console.log('Button event is binded');
    event.preventDefault();
    data = {
        name: userName,
        userId: userId,
        offerId: id,
        price: price,
        phone: phone
    };
    console.log(data);
    $.ajax({
        type: 'POST', url: 'http://localhost:5000/offers/acceptOffer', data: data
    }).done(res => {
        if (res.result == 1) window.location.href = '/offers/getAllOffers';
        else console.log('Error');
    });
});