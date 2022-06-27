var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')
var adminHelpers = require('../helpers/admin-helpers')
const Razorpay = require('razorpay');
var fs = require('fs');
const { redirect } = require('express/lib/response');
const session = require('express-session');

var instance = new Razorpay({ key_id: 'rzp_test_pF8PbdxO6F3DC6', key_secret: 'zetCHxRFjFceDBQMDKbC9i3t', });

verifyLogin = (req, res, next) => {

    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }


}

router.get('/', verifyLogin, (req, res) => {
    res.redirect('/user/dashboard')
});


router.get('/dashboard', verifyLogin, async (req, res) => {
    let user = req.session.user
    let productsList = await adminHelpers.getProducts();
    userHelpers.getNotEnrolledCourses(user._id).then((coursesList) => {
        res.render('user/dashboard', { coursesList, user, productsList });
    })
});

router.post('/login', (req, res) => {

    userHelpers.loginFunction(req.body).then((response) => {
        if (response.status) {

            req.session.loggedIn = true
            req.session.user = response.user
            res.redirect('/user/dashboard')


        } else {
            req.session.loginError = "Invalid username or password"
            res.redirect('/login')
        }
    })

})

router.get('/lectures/all_videos/', verifyLogin, async (req, res) => {

    let user = req.session.user

    let course_id = req.query.id

    adminHelpers.getLectures(course_id).then((lecturesList) => {

        res.render('user/lectures-list', { lecturesList, user });
    })

});

router.post('/register', (req, res) => {
    delete req.body.CnfPassword
    delete req.body.Agreement
    req.body.UID = Date.now();
    userHelpers.signUpFunction(req.body).then((response) => {
        res.redirect('/login')

    })

})


router.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect('/login')

});


router.get('/courses', verifyLogin, (req, res) => {
    let user = req.session.user

    adminHelpers.getCourses().then((coursesList) => {
        res.render('user/courses', { coursesList, user });
    })

});

router.get('/profile', verifyLogin, (req, res) => {
    let user = req.session.user


    res.render('user/profile', { user });


});


router.get('/my-courses', verifyLogin, (req, res) => {
    let user = req.session.user

    userHelpers.getEnrolledCourses(user._id).then((coursesList) => {
        res.render('user/my-courses', { coursesList, user });
    })

});


router.get('/course-details/', verifyLogin, (req, res) => {
    let courseId = req.query.id
    let user = req.session.user

    adminHelpers.getCourseDetails(courseId).then((course) => {
        res.render('user/course-details', { course, user });
    })

});

router.post('/payment_confirm', verifyLogin, (req, res) => {


    adminHelpers.getCourses().then((coursesList) => {
        res.render('user/courses', { coursesList });
    })

});


router.post('/init_payment', verifyLogin, (req, res) => {
    // let courseId = req.body.id
    // adminHelpers.getCourseDetails(courseId).then((course) => {
    //     res.render('user/course-details', { course });
    // })

    userHelpers.generateRazorpay(req.body.course_id, req.body.price).then((order) => {
        // console.log(order)
        res.json(order)
    })
});

router.post('/confirm_payment', verifyLogin, (req, res) => {
    // let courseId = req.body.id
    // adminHelpers.getCourseDetails(courseId).then((course) => {
    //     res.render('user/course-details', { course });
    // })

    userHelpers.enrollCourse(req.body.course_id, req.session.user._id, req.body.razorpay_order_id).then((order) => {
        // console.log(order)
        res.json({ status: true })
    })
});




module.exports = router;
