import Account from './model.js'
import { hash, insertInvalidFields } from './helpers.js'

export async function createAccount(req, res, next) {
  const body = req.body
  let invalidFields = []

  if (body?.rawPassword !== body?.confirmPassword) {
    invalidFields.push('confirmPassword')
  }

  delete body.confirmPassword

  body.hashedPassword = await hash(body.rawPassword)
  if (!body.hashedPassword) {
    invalidFields.push('rawPassword')
  }

  const account = new Account({ ...body })

  await account.validate().catch((error) => {
    invalidFields = insertInvalidFields(invalidFields, error)
  })
  account.set('rawPassword', undefined)
  console.log('account:', account, 'fields:', invalidFields)

  if (!invalidFields.length) {
    //await account.save()
    res.json({
      success: true,
      message: 'Account successfully created.',
      data: account
    })
  } else {
    res.json({ success: false, invalidFields })
  }
}
