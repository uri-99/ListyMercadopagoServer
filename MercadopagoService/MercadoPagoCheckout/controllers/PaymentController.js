class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    async getMercadoPagoLink(req, res) {

//        const { name, price, unit, img, token } = req.query;
        try {
            const checkout = await this.paymentService.createPaymentMercadoPago(
                req.body.name,
                req.body.price,
                req.body.unit,
                req.body.img,
                req.body.token,
            );
            //console.log(checkout.init_point);
            //return checkout.init_point;
            return res.status(200).json({
                link:checkout.init_point,
            });

            //return res.redirect(checkout.init_point);

        } catch (err) {
            console.log("error 22");

            return res.status(500).json({
                error: true,
                msg: "Hubo un error con Mercado Pago"
            });
        }
    }

    webhook(req, res) {
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", () => {
                console.log(body, "webhook response");
                res.end("ok");
            });
        }
        return res.status(200);
    }
}

module.exports = PaymentController;
