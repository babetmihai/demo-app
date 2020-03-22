import React from 'react'
import { useSelector } from 'react-redux'
import join from 'classnames'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import GoogleIcon from './google.svg'
import { Formik } from 'formik'
import { hideModal } from 'core/modals'
import {
  googleLogin,
  passwordLoginRegister,
  passwordReset,
  selectAuth
} from 'core/auth'
import { t } from 'core/intl'
import styles from './index.module.scss'

export default function LoginModal() {
  const { redirecting } = useSelector(selectAuth)
  const [visible, setVisibility] = React.useState(false)
  return (
    <Modal
      show
      size="sm"
      dialogClassName={styles.modal}
      onHide={hideModal}
    >
      <Modal.Header>
        <Modal.Title>
          {t('login')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => validateForm(values)}
          onSubmit={async (values, { setSubmitting }) => {
            await passwordLoginRegister(values)
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
            setErrors,
            setTouched
          }) => (
            <Form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  size="lg"
                  isInvalid={touched.email && errors.email}
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  value={values.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {'We\'ll never share your email with anyone else.'}
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
                <InputGroup>
                  <Form.Control
                    size="lg"
                    isInvalid={touched.password && errors.password}
                    name="password"
                    type={visible ? 'text' : 'password'}
                    placeholder="Password"
                    onChange={handleChange}
                    value={values.password}
                  />
                  <InputGroup.Append>
                    <Button
                      className={styles.showPassword}
                      variant="outline-primary"
                      onClick={() => setVisibility((visible) => !visible)}
                    >
                      {visible
                        ? <i>visibility</i>
                        : <i>visibility_off</i>
                      }
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Control.Feedback
                  type="invalid"
                  className={join(
                    styles.passwordFeedback,
                    touched.password && errors.password && styles.activeFeedback
                  )}
                >
                  {errors.password}
                </Form.Control.Feedback>
                <Form.Text>
                  <Button
                    disabled={isSubmitting || redirecting}
                    className={styles.resetPassowrd}
                    variant="link"
                    onClick={(event) => {
                      event.preventDefault()
                      const error = validateField({ id: 'email', value: values.email })
                      if (error) {
                        setTouched({ email: true })
                        setErrors({ email: error })
                      } else {
                        passwordReset(values)
                      }
                    }}
                  >
                    {t('reset.password')}
                  </Button>
                </Form.Text>
              </Form.Group>
              <Button
                size="lg"
                className={styles.submitBtn}
                disabled={isSubmitting || redirecting}
                variant="primary"
                type="submit"
              >
                {t('sign.in.or.register')}
              </Button>
              <div className="spacer" />
              <Button
                size="lg"
                className={styles.googleBtn}
                onClick={() => googleLogin()}
                disabled={isSubmitting || redirecting}
                variant="light"
              >
                <img
                  className={styles.googleLogo}
                  alt={t('sign.in.with.google')}
                  src={GoogleIcon}
                />
                {t('sign.in.with.google')}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

const validateField = ({ id, value }) => {
  switch (id) {
    case ('password'): {
      if (!value || value.length < 6) return t('short.password')
      break
    }
    case ('email'): {
      if (!value) return t('please.enter.a.valid.email')
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return t('invalid.email')
      break
    }
    default: return undefined
  }
}

const validateForm = (values = {}) => Object.keys(values)
  .reduce((acc, id) => {
    const error = validateField({ id, value: values[id] })
    if (error) acc[id] = error
    return acc
  }, {})
