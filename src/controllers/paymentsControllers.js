require('dotenv').config();
const request = require('request');

const auth = {
  user: process.env.PAYPAL_CLIENT_ID,
  pass: process.env.PAYPAL_SECRET_KEY
}

const createProduct = (req, res) => {
  
  const product = {
    name: 'Spendion subscription',
    description: 'Monthly subscription to spendion',
    type: 'SERVICE',
    category: 'SOFTWARE',
    image_url: 'https://www.google.com', // Imagen del producto
    home_url: 'https://www.google.com'
  }

  request.post(`${process.env.PAYPAL_API_SANDBOX}/v1/catalogs/products`, {
    auth,
    body: product,
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })

}

const createPlan = (req, res) => {

  const { body } = req; // product_id

  const plan = {
    name: 'PREMIUM PLAN',
    product_id: body.product_id,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit: 'MONTH',
          interval_count: 1
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 12,
        pricing_scheme: {
          fixed_price: { 
            value: '10.00', // Precio mensual
            currency_code: 'USD'
          }
        }
      }
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: { 
        value: '0.00', // Inscripción (Como en el gym)
        currency_code: 'USD'
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    },
    taxes: {
      percentage: '0.00', 
      inclusive: false
    }
  }

  request.post(`${process.env.PAYPAL_API_SANDBOX}/v1/billing/plans`, {
    auth,
    body: plan,
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })

}

const generateSubscription = (req, res) => {

  const { body } = req;

  const subscription = {
    plan_id: body.plan_id,
    start_time: "2023-11-10T00:00:00Z", // Fecha en la que inicia la subscripción.
    quantity: 1,
    subscriber: {
      name: {
        given_name: "John",
        surname: "Rockefeller"
      },
      email_address: "customer@example.com",
    },
    return_url: 'http://localhost:4000/payment/gracias',
    cancel_url: 'http://localhost:4000/payment/cancelPayment'
  }

  request.post(`${process.env.PAYPAL_API_SANDBOX}/v1/billing/subscriptions`, {
    auth,
    body: subscription,
    json: true
  }, (err, response) => {
    res.json({ data: response.body });
  })

}

/**
 * Esta función solicita al usuario autorización para que paypal pueda descontar dinero de su cuenta.
 * @param {*} req 
 * @param {*} res 
 */
const createPayment = (req, res) => {

  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '10.00'
      }
    }],
    application_context: {
      brand_name: 'spendion',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:4000/payment/executePayment', // URL a la que será redirigido el usuario si confirma. Retornará una url como esta: http://localhost:4000/execute-payment?token=5D5544678T1278516&PayerID=VWMSWKDEGP9LJ en donde está el token de la autorización. Cuando el usuario confirma lo que hace es darle permiso a paypal para tomar su dinero.
      cancel_url: 'http://localhost:4000/payment/cancelPayment' // URL a la que será redirigido el usuario si cancela
    }
  }

  request.post(`${process.env.PAYPAL_API_SANDBOX}/v2/checkout/orders`, {
    auth,
    body,
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })

}

/**
 * Esta función captura el monto de la cuenta del usuario. Hace efectivo el pago.
 * @param {*} req 
 * @param {*} res 
 */
const executePayment = (req, res) => {

  const token = req.query.token;

  // El siguiente request devuelve la data con el estado del cobro

  request.post(`${process.env.PAYPAL_API_SANDBOX}/v2/checkout/orders/${token}/capture`, {
    auth,
    body: {},
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })

}

module.exports = {
  createProduct,
  createPlan,
  generateSubscription,
  createPayment,
  executePayment
}