
$("#add_lecture_form").submit((e) => {
    // $('#cover-spin').show(0)
    // var form = $('#add_lecture_form')[0] // You need to use standard javascript object here
    // var formData = new FormData(form);
    e.preventDefault()
    $.ajax({
        url: "/admin/add-lecture",
        data: $("#add_lecture_form").serialize(),
        method: "post",
        success: function (response) {
            // $('#cover-spin').hide(0)
            if (response.status) {
                Swal.fire(
                    'Added Successfully',
                    'Lecture has been added successfully',
                    'success'
                )

                $('#add_lecture_form').each(function () {
                    this.reset();
                });
            }

        },
        error: function (err) {
            // $('#cover-spin').hide(0)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
    })
})


$("#add_course_form").submit((e) => {
    // $('#cover-spin').show(0)
    var form = $('#add_course_form')[0] // You need to use standard javascript object here
    var formData = new FormData(form);

    // formData.append('CsThumbnail')
    e.preventDefault()
    $.ajax({
        url: "/admin/add-course",
        data: formData,
        method: "post",
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false,
        success: function (response) {
            // $('#cover-spin').hide(0)
            if (response.status) {
                Swal.fire(
                    'Added Successfully',
                    'Course has been added successfully',
                    'success'
                )

                $('#add_course_form').each(function () {
                    this.reset();
                });
            }

        },
        error: function (err) {
            // $('#cover-spin').hide(0)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
    })
})

$("#edit_course_form").submit((e) => {
    // $('#cover-spin').show(0)
    var form = $('#edit_course_form')[0] // You need to use standard javascript object here
    var formData = new FormData(form);

    // formData.append('CsThumbnail')
    e.preventDefault()
    $.ajax({
        url: "/admin/edit-course",
        data: formData,
        method: "post",
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false,
        success: function (response) {
            // $('#cover-spin').hide(0)
            if (response.status) {
                Swal.fire(
                    'Successfully edited',
                    'Course has been successfully edited',
                    'success'
                )
            }

        },
        error: function (err) {
            // $('#cover-spin').hide(0)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
    })
})


$("#add_user_form").submit((e) => {
    // $('#cover-spin').show(0)
    // var form = $('#add_lecture_form')[0] // You need to use standard javascript object here
    // var formData = new FormData(form);
    e.preventDefault()
    $.ajax({
        url: "/user/register",
        data: $("#add_user_form").serialize(),
        method: "post",
        success: function (response) {
            // $('#cover-spin').hide(0)
            if (response.status) {
                Swal.fire(
                    'Added Successfully',
                    'User has been added successfully',
                    'success'
                )

                $('#add_user_form').each(function () {
                    this.reset();
                });
            }

        },
        error: function (err) {
            // $('#cover-spin').hide(0)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
    })
})