require('dotenv').config();
const request = require('request');

const db = require('./../config/database');
const model = require('./../models/paymentsModel');

let id_person = null;

const url_api = process.env.NODE_ENV === 'prod' ? process.env.PAYPAL_API_LIVE : process.env.PAYPAL_API_SANDBOX;

const auth = {
  user: process.env.NODE_ENV === 'prod' ? process.env.PAYPAL_CLIENT_ID_LIVE : process.env.PAYPAL_CLIENT_ID_SANDBOX,
  pass: process.env.NODE_ENV === 'prod' ? process.env.PAYPAL_SECRET_KEY_LIVE : process.env.PAYPAL_SECRET_KEY_SANDBOX
}

const getStartDateSuscription = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const dayCleaned = day < 10 ? `0${day}` : `${day}`;
  const monthCleaned = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${monthCleaned}-${dayCleaned}T00:00:00Z`;
}

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
  request.post(`${url_api}/v1/catalogs/products`, {
    auth: auth,
    body: product,
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })
}

const createPlan = (req, res) => {  
  console.log('creating plan...')

  const plan = {
    name: 'SPENDION SUSCRIPTION',
    product_id: req.body.product_id,
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
            value: '4.99', // This is the MRR by User
            currency_code: 'USD'
          }
        }
      }
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: { 
        value: '0.00',
        currency_code: 'USD'
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 5
    },
    taxes: {
      percentage: '0.00', 
      inclusive: false
    }
  }

  request.post(`${url_api}/v1/billing/plans`, {
    auth: auth,
    body: plan,
    json: true
  }, (err, response) => {
    res.json({ data: response.body })
  })
}

const createSubscription = async (req, res) => {
  console.log('creating subscription...');

  try {
    const response = await db.query(model.getUserById, [req.body.id_person]);
    const { fname, lname, email } = response.rows[0];

    const subscription = {
      plan_id: req.body.plan_id,
      start_time: getStartDateSuscription(), // This day start the suscription
      quantity: 1,
      subscriber: {
        name: {
          given_name: fname,
          surname: lname
        },
        email_address: email,
      },
      return_url: 'http://localhost:4000/payment/gracias',
      cancel_url: 'http://localhost:4000/payment/cancelPayment'
    }
  
    request.post(`${url_api}/v1/billing/subscriptions`, {
      auth: auth,
      body: subscription,
      json: true
    }, (err, response) => {
      console.log('response.body ->>>', response.body)
      res.json({ data: response.body });
    })
  } catch (error) {
    throw error;
  }
}

const webHookCreateProduct = async (req, res) => {
  console.log('Time to make money 🤑');
  try {
    await db.query(model.upgradePlan, [id_person]);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createProduct,
  createPlan,
  createSubscription,
  webHookCreateProduct
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
 * FUNCIONES BACKEND NECESARIAS PARA SUBSCRIPCIONES CON PAYPAL
 *   1. Crear producto.
 *      - Esto nos retorna un id de producto.
 *   2. Crear plan.
 *      - Le pasamos un id de producto y no retorna un id de plan.
 *   3. Crear subscripción.
 *      - Le pasamos un id de plan y nos retorna una url para pasarle al cliente.
 */