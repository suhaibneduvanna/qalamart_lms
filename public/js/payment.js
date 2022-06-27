
var price ;
var course_id;

var orderId;


function initiatePayment() {
    course_id = document.getElementById("course_id").value
    price = document.getElementById("course_price").value * 100
    $.ajax({
        url: "/user/init_payment",
        type: "post",
        data: {
            "course_id": course_id,
            "price": price
        },
        success: function (order) {
            razorpayPayment(order)
        }
    });
}

function confirmPayment(payment_details) {
    $.ajax({
        url: "/user/confirm_payment",
        type: "post",
        data: payment_details,
        success: function (response) {
            if (response.status) {
                Swal.fire(
                    'Successfully Enrolled',
                    'Enrollment has been successfully completed',
                    'success'
                ).then(() => {
                    window.location = '/user/my-courses'

                })
            } else {
                alert("Enrollment Failed")
            }
        }
    });
}



function razorpayPayment(order) {

    var options = {
        "key": "rzp_test_pF8PbdxO6F3DC6", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Qalamart",
        "description": "Test Transaction",
        "image": "http://localhost:3000/images/logo.svg",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            response.course_id = course_id;
            response.price = price;
            confirmPayment(response)
        },

        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
}