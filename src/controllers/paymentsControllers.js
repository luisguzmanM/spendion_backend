require('dotenv').config();
const request = require('request');

const auth = {
  user: process.env.PAYPAL_CLIENT_ID,
  pass: process.env.PAYPAL_SECRET_KEY
}

// Pasos para ejecutar una subscripción a un producto

// Paso 1
const createProduct = (req, res) => {
  console.log('creating product...');
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

// Paso 2
const createPlan = (req, res) => {  
  console.log('creating plan...')
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
            value: '9.99', // Pago recurrente (Como en el gym) esto es lo que se va a cobrar cada mes.
            currency_code: 'USD' // Puedes configurar la moneda
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
      payment_failure_threshold: 3 // Si el pago falla lo intenta tres veces mas.
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

// Paso 3
const createSubscription = (req, res) => {
  console.log('creating subscription...');
  const { body } = req;
  const subscription = {
    plan_id: body.plan_id,
    start_time: "2024-01-01T00:00:00Z", // Fecha en la que inicia la subscripción. (Aquí puedo poner que inicie 7 días despues par darle 7 dias gratis)
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
    console.log('Subscription link created successfully. Time to make money 🤑');
    res.json({ data: response.body });
  })
}

// Pasos para ejecutar un pago único de producto

// Paso 1
const createPayment = (req, res) => {
  /**
 * Esta función solicita al usuario autorización para que paypal pueda descontar dinero de su cuenta.
 */
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

// Paso 2
const executePayment = (req, res) => {
/**
 * Esta función captura el monto de la cuenta del usuario. Hace efectivo el pago.
 */
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
  createSubscription,
  createPayment,
  executePayment
}

/**
 * PASOS GENERAR COBROS CON PAYPAL:
 * 
 * CONFIGURACIONES:
 *   1. Crear App: Esto devuelve un client ID y un secret ID.
 *   2. Instalar en la app backend de node -> express, cors y request.
 *   3. Importar estas librerías en el archivo donde se van a ejecutar las funciones de pago de paypal.
 *   3. Inicializar express en el archivo y utilizar los cors.
 *   4. Guardar el cliente ID y el secret ID en las variables de entorno y llamarlas en una variable
 *   5. SandBox es para pruebas y live es para producción.
 *   6. Declarar objeto que contenga client ID y Secret ID.
 * 
 * B. FUNCIONES BACKEND NECESARIAS PARA SUBSCRIPCIONES CON PAYPAL
 *   1. Crear producto.
 *      - Esto nos retorna un id de producto.
 *   2. Crear plan.
 *      - Le pasamos un id de producto y no retorna un id de plan.
 *   3. Crear subscripción.
 *      - Le pasamos un id de plan y nos retorna una url para pasarle al cliente.
 * 
 * C. FUNCIONES BACKEND NECESARIAS PARA PAGOS ÚNICOS CON PAYPAL
 *   1. Crear pago.
 *      - Retorn un objeto. La que nos interesa es la que dice "approve". Copiar esa url y abrir en incógnito.
 *      - Ir a sandbox accounts y obtener un usuario de prueba.
 *      - Iniciar sesión con usuario simulado de paypal (No iniciar sesión con tu cuenta real).
 *   2. Ejecutar pago.
 */