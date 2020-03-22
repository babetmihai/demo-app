import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap'
import Page from 'layout/Page'
import styles from './index.module.scss'
import join from 'classnames'

import { ReactComponent as GitHubIcon } from 'icons/github.svg'
import { ReactComponent as IconReact } from 'icons/react.svg'
import { ReactComponent as IconD3 } from 'icons/d3.svg'
import { ReactComponent as IconNodejs } from 'icons/nodejs.svg'
import { ReactComponent as IconSass } from 'icons/sass.svg'
import { ReactComponent as IconRedux } from 'icons/redux.svg'
import { ReactComponent as IconFirebase } from 'icons/firebase.svg'
import { ReactComponent as IconJavascript } from 'icons/javascript.svg'
import { ReactComponent as IconHtml } from 'icons/html.svg'
import { ReactComponent as IconCss } from 'icons/css.svg'
import { t } from 'core/intl'

const lists = [
  [
    { id: 'react', component: IconReact, href: 'https://reactjs.org' },
    { id: 'redux', component: IconRedux, href: 'https://redux.js.org/' },
    { id: 'd3', component: IconD3, href: 'https://d3js.org' },
    { id: 'sass', component: IconSass, href: 'https://sass-lang.com/' },
    { id: 'nodejs', component: IconNodejs, href: 'https://nodejs.org/en/about' },
    { id: 'firebase', component: IconFirebase, href: 'https://firebase.google.com/' }
  ],
  [
    { id: 'javascript', component: IconJavascript },
    { id: 'html', component: IconHtml },
    { id: 'css', component: IconCss }
  ]
]

export default function Home({ routes }) {
  return (
    <Page className={styles.home}>
      <div className={styles.list}>
        {routes.slice(1).map(({ id, icon, path }) => {
          return (
            <Button
              key={id}
              as={Link}
              variant="light"
              className={join('card', styles.route)}
              to={path}
            >
              <i>{icon}</i>
            </Button>
          )
        })}
      </div>
      <div className={styles.title}>
        <h1>Mihai Babet</h1>
        <h4>Web Developer</h4>
        <Button
          variant="light"
          className={styles.github}
          as="a"
          target="_blank"
          rel="noreferrer noopener"
          href="https://github.com/babetmihai"
        >
          <GitHubIcon />
        </Button>
      </div>
      {lists.map((list, index) => (
        <div className={styles.list} key={index}>
          {list.map(({ component: Logo, id, href }) => (
            <OverlayTrigger
              key={id}
              rootClose
              placement="auto"
              trigger="click"
              overlay={(
                <Popover className={styles.options}>
                  <Popover.Title>
                    <a
                      as="a"
                      target="_blank"
                      rel="noreferrer noopener"
                      href={href}
                    >{t(id)}</a>
                  </Popover.Title>
                  <Popover.Content>
                    {t(`${id}.description`)}
                  </Popover.Content>
                </Popover>
              )}
            >
              <Button
                variant="light"
                className={styles.button}
              >
                <Logo className={styles.logo} />
              </Button>
            </OverlayTrigger>
          ))}
        </div>
      ))}
    </Page>
  )
}