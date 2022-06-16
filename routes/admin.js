var express = require('express');
var router = express.Router();
var adminHelpers = require("../helpers/admin-helpers")
var fs = require('fs');
const { redirect } = require('express/lib/response');
const session = require('express-session');
const axios = require('axios');

var FormData = require('form-data');


verifyLogin = (req, res, next) => {

  if (req.session.loggedIn && req.session.user.Admin) {
    next()
  } else {
    res.redirect('/admin-login')
  }


}

/* GET home page. */
router.get('/', verifyLogin, (req, res) => {
  res.redirect('/admin/dashboard')
});

router.get('/courses', verifyLogin, (req, res) => {

  let user = req.session.user
  console.log(user)

  adminHelpers.getCourses().then((coursesList) => {

    res.render('admin/courses', { coursesList, user });
  })

});


router.get('/lectures', verifyLogin, (req, res) => {

  let user = req.session.user

  adminHelpers.getCourses().then((coursesList) => {

    res.render('admin/lectures', { coursesList, user });
  })

});

router.get('/add-user', verifyLogin, (req, res) => {
  res.render('admin/add-user');

});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin-login')
});

router.get('/users', (req, res) => {
  let user = req.session.user;

  adminHelpers.getUsers().then((userList) => {

    res.render('admin/users', { userList, user });
  })


});

router.post('/login', (req, res) => {

  adminHelpers.loginFunction(req.body).then((response) => {
    if (response.status) {

      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/admin/dashboard')


    } else {
      req.session.loginError = "Invalid username or password"
      res.redirect('/admin-login')
    }
  })

})

router.get('/dashboard', verifyLogin, (req, res) => {
  let user = req.session.user
  console.log(user)
  res.render('admin/dashboard', { user });
});


router.get('/add-course', (req, res) => {
  let user = req.session.user;

  res.render('admin/add-course', { user })
})

router.post('/add-course', (req, res) => {

  adminHelpers.addCourse(req.body, (id) => {
    let image = req.files.CsThumbnail
    image.mv('./public/uploads/course-thumbnail/' + id + '.jpg', (err, done) => {
      if (!err) {
        // res.redirect("/admin/add-course")
        res.json({ status: true })
      } else {
        console.log(err)
      }
    })

  })

})



router.get('/edit-course/', async (req, res) => {
  let courseId = req.query.id
  let user = req.session.user;
  let course = await adminHelpers.getCourseDetails(courseId)
  res.render('admin/edit-course', { course, user })

})

router.post('/edit-course', (req, res) => {
  let courseId = req.body.id

  adminHelpers.updateCourse(courseId, req.body).then(() => {

    if (req.files) {
      let image = req.files.CsThumbnail
      image.mv('./public/uploads/course-thumbnail/' + courseId + '.jpg').then((err, done) => {
        if (!err) {
          // res.redirect("/admin/add-course")
          res.json({ status: true })
        } else {
          console.log(err)
        }
      })


    } else {
      res.json({ status: true })


    }

  })
})

router.get('/delete-course/', (req, res) => {
  let courseId = req.query.id

  adminHelpers.deleteCourse(courseId).then((response) => {
    fs.unlink('./public/uploads/course-thumbnail/' + courseId + '.jpg', () => { })
    res.redirect('/admin/courses')
  })


})


router.get('/add-lecture', (req, res) => {
  let user = req.session.user
  adminHelpers.getCourses().then((coursesList) => {
    res.render('admin/add-lecture', { coursesList, user })

  })
})

router.post('/add-lecture', async (req, res) => {

  adminHelpers.addLecture(req.body, (lecture) => {
    res.json({ status: true })
  })

})


router.get('/add-marks/', (req, res) => {
  let studentId = req.query.id

  res.render('admin/add-marks', { studentId })
})

router.post('/add-marks/', (req, res) => {
  let studentId = req.query.id
  let marks = req.body;

  studentHelper.addMarks(marks, studentId).then((data) => {
    res.redirect('/admin/search-student')
  })

})



router.get('/view-student/', async (req, res) => {
  let studentId = req.query.id
  let student = await studentHelper.getStudentDetails(studentId)

  let marks = await studentHelper.getMarks(studentId)
  res.render('admin/view-student', { student, marks })
})

router.get('/view-marks/', async (req, res) => {

  let studentId = req.query.id;
  let marks = await studentHelper.getMarks(studentId)

  res.json(marks)


})


router.post('/edit-marks/', async (req, res) => {
  let marks = req.body;
  let studentId = req.body.studentId
  let subject = req.body.Subject
  console.log(marks)
  if (Array.isArray(subject)) {
    let arrayofMarks = []
    for (i = 0; i < subject.length; i++) {

      let sub = marks.Subject[i]
      let mark = marks.Mark[i]
      let object = {
        Semester: marks.Semester,
        Subject: sub,
        Mark: mark

      }

      arrayofMarks.push(object)

    }
    studentHelper.editMarks(studentId, arrayofMarks)
    res.json({ status: true })


  } else {

    studentHelper.editMarks(studentId, marks)
    res.json({ status: true })

  }


  // console.log(array)

})



module.exports = router;
