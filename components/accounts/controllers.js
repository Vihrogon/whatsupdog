import Account from './model.js'
import { populateInvalidFields } from './helpers.js'

export async function createAccount(req, res, next) {
  const account = new Account({ ...req.body })

  let invalidFields

  await account.validate().catch((error) => {
    invalidFields = populateInvalidFields(error)
  })

  if (Object.getOwnPropertyNames(invalidFields).length) {
    res.json({
      success: false,
      message: "You shoul'd provide valid information.",
      data: { invalidFields }
    })
  } else {
    //await account.save()
    res.json({
      success: true,
      message: 'Account successfully created.',
      data: {}
    })
  }
}
