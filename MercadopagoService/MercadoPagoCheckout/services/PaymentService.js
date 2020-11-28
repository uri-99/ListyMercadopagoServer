const axios = require("axios");

class PaymentService {

    constructor() {
        this.tokensMercadoPago = {
            prod: {},
            test: {
                access_token:
                    ""
// el access_token de MP //lo pasé a linea 20, lo recibe como parametro desde Listy
            }
        };
// declaramos de la siguiente manera el token, para que sea más fácil cambiarlo dependiendo del ambiente
        this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
        // declaramos la url en el constructor para poder accederla a lo largo de toda la clase
    }

    async createPaymentMercadoPago(name, price, unit, img, token) {

// recibimos las props que le mandamos desde el PaymentController
        const url = `${this.mercadoPagoUrl}/preferences?access_token=${token}`;
// url a la que vamos a hacer los requests

        const items = [
            {
                id: "1234",
// id interno (del negocio) del item
                title: name,
// nombre que viene de la prop que recibe del controller
                description: "Pago de Listy Proyect",
                // descripción del producto
                picture_url: img,
// url de la imágen del producto
                category_id: "1234",
// categoría interna del producto (del negocio)
                quantity: 1,
// cantidad, que tiene que ser un intiger
                currency_id: "ARS",
// id de la moneda, que tiene que ser en ISO 4217
                unit_price: price,
                // el precio, que por su complejidad tiene que ser tipo FLOAT
            }
        ];

        const preferences = {
// declaramos las preferencias de pago
            items,
// el array de objetos, items que declaramos más arriba
            external_reference: "referencia del negocio",
// referencia para identificar la preferencia, puede ser practicamente cualquier valor
            payer: {
// información del comprador, si estan en producción tienen que //traerlos del request
//(al igual que hicimos con el precio del item)
                name: "Listy",
                surname: "Proyect",
                email: "uriel.mihura@gmail.com",
                // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba
                phone: {
                    area_code: "11",
                    number: "22223333"
                },
                address: {
                    zip_code: "1111",
                    street_name: "False",
                    street_number: "123"
                }
            },
            payment_methods: {
// declaramos el método de pago y sus restricciones
                excluded_payment_methods: [
// aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
                    {
                        //id: "amex"
                    }
                ],
                excluded_payment_types: [{ id: "atm" }],
// aca podemos excluir TIPOS de pagos, es un array de objetos
                installments: 6,
// limite superior de cantidad de cuotas permitidas
                default_installments: 6
// la cantidad de cuotas que van a aparecer por defecto
            },
            back_urls: {
// declaramos las urls de redireccionamiento
                //success: "https://localhost:3000/success",
                success: "https://listy-itba-app.web.app/home",
// url que va a redireccionar si sale todo bien
                pending: "https://localhost:3000.com/pending",
// url a la que va a redireccionar si decide pagar en efectivo por ejemplo
                failure: "https://localhost:3000.com/error"
// url a la que va a redireccionar si falla el pago
            },
            notification_url: "https://mercadopago-checkout.herokuapp.com/webhook",
// declaramos nuestra url donde recibiremos las notificaciones
            auto_return: "approved"
// si la compra es exitosa automaticamente redirige a "success" de back_urls
        };

        try {
            const request = await axios.post(url, preferences, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias
                headers: {
// y el header, que contiene content-Type
                    "Content-Type": "application/json"
                }
            });
            //console.log(request.data.init_point);
            //return request.data.init_point;
            return request.data;
// devolvemos la data que devuelve el POST
        } catch (e) {
            console.log("catch 112");
            console.log(e);
// mostramos error en caso de que falle el POST
        }
    }
}

//NOTA: TODAS las URLS que usemos tienen que ser reales,
//si prueban con localhost, va a fallar

module.exports = PaymentService;
