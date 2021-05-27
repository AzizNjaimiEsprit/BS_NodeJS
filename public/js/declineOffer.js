const dismissButton = document.querySelector(".dismiss-btn");

dismissButton.addEventListener("click", (event) => {
    console.log('Starting')
    event.preventDefault();
    data = {
        offerId: id,
    };
    console.log(data);
    $.ajax({
        type: 'POST', url: 'http://localhost:5000/offers/declineOffer', data: data
    }).done(res => {
        if (res.result == 1) window.location.href = '/offers/getAllOffers';
        else console.log('Error');
    });
});