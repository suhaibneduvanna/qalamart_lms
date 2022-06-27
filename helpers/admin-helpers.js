
var db = require('../config/connection')
var collection = require('../config/collections')
const bycrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { use } = require('../routes/user')
const collections = require('../config/collections')
// const productHelpers = require('./product-helpers')
module.exports = {
    loginFunction: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            let user = await db.get().collection(collection.ADMINS_COLLECTIONS).findOne({ Email: userData.Email })
            console.log(userData.Password)
            if (user) {
                bycrypt.compare(userData.Password, user.Password).then((status) => {

                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed ')
                resolve({ status: false })
            }

        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let userList = await db.get().collection(collection.USERS_COLLECTIONS).find().toArray()

            resolve(userList)
        })

    },

    addCourse: (course, callback) => {
        db.get().collection(collection.COURSES_COLLECTIONS).insertOne(course).then((data) => {
            callback(data.ops[0]._id)

        })
    },

    addLecture: (courseId, lecture) => {

        return new Promise(async (resolve, reject) => {
            let lectureExit = await db.get().collection(collection.COURSES_COLLECTIONS).findOne({ _id: objectId(courseId) })
            if (lectureExit.Lectures) {

                db.get().collection(collection.COURSES_COLLECTIONS).updateOne({ _id: objectId(courseId) }, {

                    $push: { Lectures: lecture }

                }).then((response) => {
                    resolve(response)
                })



            } else {

                db.get().collection(collection.COURSES_COLLECTIONS).updateOne({ _id: objectId(courseId) }, { $set: { "Lectures": [lecture] } },).then((response) => {
                    resolve()
                })
            }
        })
    },

    getUser: (uid) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USERS_COLLECTIONS).findOne({ _id: objectId(uid) })

            resolve(user)
        })

    },

    updateUser: (uid, userData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USERS_COLLECTIONS).updateOne({ _id: objectId(uid) }, {
                $set: {
                    "Username": userData.Username,
                    "Email": userData.Email,
                    "Phone": userData.Phone
                }
            }).then((response) => {
                resolve()
            })
        })

    },

    getCourses: () => {
        return new Promise(async (resolve, reject) => {
            let courseList = await db.get().collection(collection.COURSES_COLLECTIONS).find().toArray()

            resolve(courseList)
        })

    },


    // getLectures: () => {
    //     return new Promise(async (resolve, reject) => {
    //         let lectureList = await db.get().collection(collection.LECTURES_COLLECTIONS).find().toArray()

    //         resolve(lectureList)
    //     })

    // },

    getLectures: (course_id) => {
        return new Promise(async (resolve, reject) => {
            let lectureList = await db.get().collection(collection.COURSES_COLLECTIONS).aggregate(
                [
                    {
                        $match: {
                            _id: objectId(course_id)
                        }
                    },
                    { $unwind: '$Lectures' },
                    {
                        $sort: {
                            'Lectures.LtNo': 1
                        }
                    },
                    {
                        $group: {
                            _id: '$_id', 'Videos': {
                                $push:
                                    '$Lectures'
                            }
                        }
                    },
                    {
                        $project: {
                            'Lectures': '$Videos'
                        }
                    }


                ]
            ).toArray()
            console.log(lectureList[0])
            resolve(lectureList[0])
        })


    },

    deleteCourse: (courseId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COURSES_COLLECTIONS).removeOne({ _id: objectId(courseId) }).then((response) => {
                resolve(response)
            })
        })
    },

    deleteLecture: (courseId, videoId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COURSES_COLLECTIONS).updateOne(
                { _id: objectId(courseId) },
                { $pull: { Lectures: { VID: videoId } } },
                false, // Upsert
                true, // Multi

            ).then((response) => {
                resolve(response)
            })
        })
    },

    getCourseDetails: (courseId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COURSES_COLLECTIONS).findOne({ _id: objectId(courseId) }).then((course) => {
                resolve(course)
            })
        })
    },

    updateCourse: (courseId, courseDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.COURSES_COLLECTIONS).updateOne({ _id: objectId(courseId) }, {

                $set: {
                    Title: courseDetails.Title,
                    CsCategory: courseDetails.CsCategory,
                    Language: courseDetails.Language,
                    BriefDesc: courseDetails.BriefDesc,
                    Desc: courseDetails.Desc,
                    Price: courseDetails.Price,

                }
            }).then((response) => {
                resolve()
            })
        })
    },


    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            let productsList = await db.get().collection(collection.PRODUCTS_COLLECTIONS).find().toArray()

            resolve(productsList)
        })

    },
}