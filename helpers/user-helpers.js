var db = require('../config/connection')
var collection = require('../config/collections')
const bycrypt = require('bcrypt')
const res = require('express/lib/response')
var objectId = require('mongodb').ObjectID
// const { use } = require('../routes/user')
// const productHelpers = require('./product-helpers')
const Razorpay = require('razorpay');

var instance = new Razorpay({ key_id: 'rzp_test_pF8PbdxO6F3DC6', key_secret: 'zetCHxRFjFceDBQMDKbC9i3t', });

module.exports = {
    signUpFunction: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bycrypt.hash(userData.Password, 10)

            db.get().collection(collection.USERS_COLLECTIONS).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })

        })

    },

    loginFunction: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            let user = await db.get().collection(collection.USERS_COLLECTIONS).findOne({ Email: userData.Email })

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

    enrollCourse: (courseId, userId, orderId) => {

        let courseObject = {
            course: objectId(courseId),
            orderId: orderId
        }

        return new Promise(async (resolve, reject) => {
            let userEnrolledCourses = await db.get().collection(collection.USER_ENROLLED_COLLECTIONS).findOne({ user: userId })
            if (userEnrolledCourses) {

                db.get().collection(collection.USER_ENROLLED_COLLECTIONS).updateOne({ user: userId }, {

                    $push: { courses_enrolled: courseObject }

                }).then((response) => {
                    resolve(response)
                })



            } else {
                let enrolledCoursesObject = {
                    user: userId,
                    courses_enrolled: [courseObject]

                }

                db.get().collection(collection.USER_ENROLLED_COLLECTIONS).insertOne(enrolledCoursesObject).then((response) => {
                    resolve()
                })
            }
        })
    },

    getEnrolledCourses: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userCourses = await db.get().collection(collection.USER_ENROLLED_COLLECTIONS).aggregate([
                {
                    $match: { user: userId }
                },

                {
                    $unwind: '$courses_enrolled'
                },
                {
                    $project: {
                        course_id: '$courses_enrolled.course',
                        order_id: '$courses_enrolled.orderId',
                    }
                },
                {
                    $lookup: {
                        from: collection.COURSES_COLLECTIONS,
                        localField: 'course_id',
                        foreignField: '_id',
                        as: 'course_details'

                    }
                }
                // {
                //     $lookup:{
                //         from:collection.COURSES_COLLECTIONS,
                //         let:{coursesList:'$courses_enrolled'},
                //         pipeline:[{
                //             $match:{
                //                 $expr:{
                //                     $in:['$_id','$$coursesList']
                //                 }
                //             }
                //         }],
                //         as:'enrolledCourses'
                //     }
                // }
            ]).toArray()
            console.log(userCourses)
            resolve(userCourses)
        })
    },

    cartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTIONS).findOne({ user: objectId(userId) })
            let cartcount = 0
            if (cart) {
                cartcount = cart.products.length
            }
            resolve(cartcount)
        })
    },

    generateRazorpay: (orderId, price) => {
        return new Promise(async (resolve, reject) => {
            var options = {
                amount: price,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err)
                } else {
                    resolve(order)
                }
            });
        })
    }


}