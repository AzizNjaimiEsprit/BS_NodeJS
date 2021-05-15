const form = document.getElementById("offer-form");
form.addEventListener("submit", submitOffer);

function submitOffer (event) {
    event.preventDefault();
    const title = document.getElementById("title-field").value;
    const author = document.getElementById("author-field").value;
    const desc = document.getElementById("description-field").value;
    const price = document.getElementById("price-field").value;
    const files = document.getElementById("customFile");
    const formData = new FormData();
    console.log(sessionStorage.currentUser);
    console.log(sessionStorage.currentUser.userId);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("userId", JSON.parse(sessionStorage.currentUser).userId);
    
    for(let i =0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
    }
    console.log(formData);
    fetch("http://localhost:5000/offers/addOffer", {
        method: 'post',
        body: formData
    })
        .then((res) => {
            alert("Your offer is saved");
            /*
            if (res.status == 1) // redirect to offers list page
            else // stay at the same page
            */
        });
}