const express = require("express");
const router = express.Router();

const {
    createPayment,
    checkStatus,
    updateStatus
} = require("../controllers/paymentController");



router.post("/create", createPayment);

router.get("/status/:orderId", checkStatus);

router.post("/webhook", updateStatus);


module.exports = router;
